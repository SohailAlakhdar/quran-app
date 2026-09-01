const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const Surah = require('../models/Surah');
const User = require('../models/User');

/**
 * Randomly select `count` active questions for a surah/type using
 * MongoDB's $sample aggregation stage (server-side randomization only).
 */
async function pickRandomQuestions(surahId, type, count) {
  return Question.aggregate([
    {
      $match: {
        surah: new mongoose.Types.ObjectId(surahId),
        type,
        isActive: true
      }
    },
    { $sample: { size: count } }
  ]);
}

async function startQuiz(userId, surahId, type) {
  const surah = await Surah.findById(surahId);
  if (!surah) {
    const e = new Error('السورة غير موجودة.');
    e.statusCode = 404;
    throw e;
  }

  const questionCount = surah.quizQuestionCount;
  const availableCount = await Question.countDocuments({ surah: surahId, type, isActive: true });

  if (availableCount < questionCount) {
    const e = new Error('لا يوجد عدد كافٍ من الأسئلة لهذا التدريب.');
    e.statusCode = 400;
    throw e;
  }

  const questions = await pickRandomQuestions(surahId, type, questionCount);

  const quiz = await Quiz.create({
    user: userId,
    surah: surahId,
    type,
    questions: questions.map((q) => q._id),
    totalQuestions: questions.length,
    status: 'in_progress'
  });

  // Strip correctAnswer before returning to the client.
  const safeQuestions = questions.map((q) => ({
    id: q._id,
    text: q.text,
    options: q.options,
    difficulty: q.difficulty
  }));

  return { quiz, questions: safeQuestions };
}

async function submitAnswer(userId, quizId, questionId, selectedAnswer) {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    const e = new Error('الاختبار غير موجود.');
    e.statusCode = 404;
    throw e;
  }
  if (String(quiz.user) !== String(userId)) {
    const e = new Error('غير مصرح لك بالوصول لهذا الاختبار.');
    e.statusCode = 403;
    throw e;
  }
  if (quiz.status !== 'in_progress') {
    const e = new Error('تم إنهاء هذا الاختبار بالفعل.');
    e.statusCode = 400;
    throw e;
  }
  const belongsToQuiz = quiz.questions.some((q) => String(q) === String(questionId));
  if (!belongsToQuiz) {
    const e = new Error('هذا السؤال لا ينتمي لهذا الاختبار.');
    e.statusCode = 400;
    throw e;
  }
  const alreadyAnswered = quiz.answers.some((a) => String(a.question) === String(questionId));
  if (alreadyAnswered) {
    const e = new Error('تمت الإجابة على هذا السؤال مسبقاً.');
    e.statusCode = 409;
    throw e;
  }

  const question = await Question.findById(questionId);
  if (!question) {
    const e = new Error('السؤال غير موجود.');
    e.statusCode = 404;
    throw e;
  }

  const isCorrect = question.correctAnswer === selectedAnswer;
  const starsEarned = isCorrect ? 1 : 0;

  quiz.answers.push({
    question: questionId,
    selectedAnswer,
    isCorrect,
    answeredAt: new Date()
  });
  quiz.currentQuestion += 1;
  if (isCorrect) {
    quiz.correctAnswers += 1;
    quiz.starsEarned += 1;
  } else {
    quiz.wrongAnswers += 1;
  }

  let quizCompleted = false;
  if (quiz.answers.length >= quiz.totalQuestions) {
    quiz.status = 'completed';
    quiz.completedAt = new Date();
    quiz.score = Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100);
    quizCompleted = true;
  }

  await quiz.save();

  if (quizCompleted) {
    await applyQuizResultsToUser(userId, quiz);
  }

  return {
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    starsEarned,
    quizCompleted
  };
}

async function applyQuizResultsToUser(userId, quiz) {
  const user = await User.findById(userId);
  if (!user) return;

  user.stars += quiz.starsEarned;
  user.totalQuizzes += 1;
  user.totalCorrectAnswers += quiz.correctAnswers;
  user.totalQuestionsAnswered += quiz.totalQuestions;
  user.lastActivity = new Date();

  // Recompute a running average score across all completed quizzes.
  const completedQuizzes = await Quiz.find({ user: userId, status: 'completed' }).select('score');
  const totalScore = completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
  user.averageScore = completedQuizzes.length
    ? Math.round(totalScore / completedQuizzes.length)
    : 0;

  await user.save();

  const { checkAndUnlockAchievements } = require('./achievement.service');
  await checkAndUnlockAchievements(userId);
}

module.exports = { startQuiz, submitAnswer, pickRandomQuestions };
