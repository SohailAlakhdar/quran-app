const User = require('../models/User');
const Question = require('../models/Question');
const Surah = require('../models/Surah');
const Quiz = require('../models/Quiz');
const { success } = require('../utils/apiResponse');

// GET /api/admin/statistics
async function getStatistics(req, res, next) {
  try {
    const [totalChildren, totalQuestions, totalSurahs, totalQuizzes] = await Promise.all([
      User.countDocuments({ role: 'child' }),
      Question.countDocuments(),
      Surah.countDocuments(),
      Quiz.countDocuments({ status: 'completed' })
    ]);

    const scoreAgg = await Quiz.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    const averageScore = scoreAgg.length ? Math.round(scoreAgg[0].avgScore) : 0;

    const mostPracticedSurahs = await Quiz.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$surah', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'surahs', localField: '_id', foreignField: '_id', as: 'surah' } },
      { $unwind: '$surah' },
      { $project: { _id: 0, surah: { name: 1, arabicName: 1, number: 1 }, count: 1 } }
    ]);

    const questionsByType = await Question.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const quizzesByType = await Quiz.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    return success(res, 200, 'تم جلب الإحصائيات بنجاح.', {
      totalChildren,
      totalQuestions,
      totalSurahs,
      totalQuizzes,
      averageScore,
      mostPracticedSurahs,
      questionsByType,
      quizzesByType
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users
async function getUsers(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);

    const filters = { role: 'child' };
    if (req.query.search) {
      filters.firstName = { $regex: req.query.search, $options: 'i' };
    }

    const [users, total] = await Promise.all([
      User.find(filters)
        .select('firstName createdAt totalQuizzes averageScore stars lastActivity')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filters)
    ]);

    return success(res, 200, 'تم جلب المستخدمين بنجاح.', {
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStatistics, getUsers };
