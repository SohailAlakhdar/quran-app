const Quiz = require('../models/Quiz');
const Surah = require('../models/Surah');
const { success } = require('../utils/apiResponse');

// GET /api/progress
async function getProgress(req, res, next) {
  try {
    const userId = req.user._id;

    const completedQuizzes = await Quiz.find({ user: userId, status: 'completed' })
      .populate('surah', 'name arabicName number')
      .sort({ completedAt: -1 });

    const memorizationQuizzes = completedQuizzes.filter((q) => q.type === 'memorization');
    const tadabburQuizzes = completedQuizzes.filter((q) => q.type === 'tadabbur');

    const totalSurahs = await Surah.countDocuments();

    // A surah is "completed" once the user has done both quiz types for it.
    const bySurah = {};
    completedQuizzes.forEach((q) => {
      const key = String(q.surah._id);
      if (!bySurah[key]) bySurah[key] = new Set();
      bySurah[key].add(q.type);
    });
    const completedSurahsCount = Object.values(bySurah).filter(
      (types) => types.has('memorization') && types.has('tadabbur')
    ).length;

    const avgOf = (arr) =>
      arr.length ? Math.round(arr.reduce((s, q) => s + q.score, 0) / arr.length) : 0;

    return success(res, 200, 'تم جلب التقدم بنجاح.', {
      totalQuizzes: req.user.totalQuizzes,
      totalStars: req.user.stars,
      totalQuestionsAnswered: req.user.totalQuestionsAnswered,
      totalCorrectAnswers: req.user.totalCorrectAnswers,
      averageScore: req.user.averageScore,
      completedSurahs: completedSurahsCount,
      totalSurahs,
      memorizationProgress: avgOf(memorizationQuizzes),
      tadabburProgress: avgOf(tadabburQuizzes),
      recentQuizzes: completedQuizzes.slice(0, 5).map((q) => ({
        quizId: q._id,
        surah: q.surah,
        type: q.type,
        score: q.score,
        starsEarned: q.starsEarned,
        completedAt: q.completedAt
      }))
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProgress };
