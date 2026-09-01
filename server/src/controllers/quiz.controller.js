const Quiz = require('../models/Quiz');
const Surah = require('../models/Surah');
const quizService = require('../services/quiz.service');
const { success, error } = require('../utils/apiResponse');

// POST /api/quizzes/start
async function startQuiz(req, res, next) {
  try {
    const { surahId, type } = req.body;
    const { quiz, questions } = await quizService.startQuiz(req.user._id, surahId, type);
    return success(res, 201, 'تم بدء الاختبار بنجاح.', {
      quizId: quiz._id,
      surahId,
      type,
      totalQuestions: quiz.totalQuestions,
      questions
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/quizzes/:quizId/answer
async function submitAnswer(req, res, next) {
  try {
    const { quizId } = req.params;
    const { questionId, selectedAnswer } = req.body;
    const result = await quizService.submitAnswer(req.user._id, quizId, questionId, selectedAnswer);
    return success(res, 200, result.correct ? 'إجابة صحيحة!' : 'إجابة غير صحيحة.', result);
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/:quizId/result
async function getResult(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate('surah', 'name arabicName number');
    if (!quiz) return error(res, 404, 'الاختبار غير موجود.');
    if (String(quiz.user) !== String(req.user._id)) {
      return error(res, 403, 'غير مصرح لك بالوصول لهذا الاختبار.');
    }
    if (quiz.status !== 'completed') {
      return error(res, 400, 'الاختبار لم يكتمل بعد.');
    }

    const percentage = Math.round((quiz.correctAnswers / quiz.totalQuestions) * 100);

    return success(res, 200, 'تم جلب نتيجة الاختبار.', {
      quizId: quiz._id,
      surah: quiz.surah,
      type: quiz.type,
      totalQuestions: quiz.totalQuestions,
      correctAnswers: quiz.correctAnswers,
      wrongAnswers: quiz.wrongAnswers,
      percentage,
      starsEarned: quiz.starsEarned,
      completedAt: quiz.completedAt
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/quizzes/:quizId/review
async function getReview(req, res, next) {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate({
      path: 'answers.question',
      select: 'text options correctAnswer explanation'
    }).populate('questions');

    if (!quiz) return error(res, 404, 'الاختبار غير موجود.');
    if (String(quiz.user) !== String(req.user._id)) {
      return error(res, 403, 'غير مصرح لك بالوصول لهذا الاختبار.');
    }

    const questionMap = {};
    quiz.questions.forEach((q) => { questionMap[String(q._id)] = q; });

    const review = quiz.answers.map((a) => {
      const q = questionMap[String(a.question._id || a.question)] || a.question;
      return {
        question: q.text,
        options: q.options,
        selectedAnswer: a.selectedAnswer,
        correctAnswer: q.correctAnswer,
        isCorrect: a.isCorrect,
        explanation: q.explanation
      };
    });

    return success(res, 200, 'تم جلب مراجعة الاختبار.', { review });
  } catch (err) {
    next(err);
  }
}

module.exports = { startQuiz, submitAnswer, getResult, getReview };
