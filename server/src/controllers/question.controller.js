const mongoose = require('mongoose');
const Question = require('../models/Question');
const { success, error } = require('../utils/apiResponse');

function buildFilters(query) {
  const filters = {};
  if (query.surah && mongoose.isValidObjectId(query.surah)) filters.surah = query.surah;
  if (query.type) filters.type = query.type;
  if (query.difficulty) filters.difficulty = query.difficulty;
  return filters;
}

// GET /api/questions (child-facing, never includes correctAnswer)
async function getQuestions(req, res, next) {
  try {
    const filters = { ...buildFilters(req.query), isActive: true };
    const questions = await Question.find(filters).select('surah type text options difficulty');
    const safe = questions.map((q) => ({
      id: q._id,
      surah: q.surah,
      type: q.type,
      text: q.text,
      options: q.options,
      difficulty: q.difficulty
    }));
    return success(res, 200, 'تم جلب الأسئلة بنجاح.', { questions: safe });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/questions (paginated, includes correctAnswer)
async function getAdminQuestions(req, res, next) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const filters = buildFilters(req.query);

    if (req.query.search) {
      filters.text = { $regex: req.query.search, $options: 'i' };
    }

    const [questions, total] = await Promise.all([
      Question.find(filters)
        .populate('surah', 'name arabicName number')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Question.countDocuments(filters)
    ]);

    return success(res, 200, 'تم جلب الأسئلة بنجاح.', {
      data: questions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/questions/:id
async function getAdminQuestionById(req, res, next) {
  try {
    const question = await Question.findById(req.params.id).populate('surah', 'name arabicName number');
    if (!question) return error(res, 404, 'السؤال غير موجود.');
    return success(res, 200, 'تم جلب السؤال بنجاح.', { question });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/questions
async function createQuestion(req, res, next) {
  try {
    const question = await Question.create({ ...req.body, createdBy: req.user._id });
    return success(res, 201, 'تم إضافة السؤال بنجاح.', { question });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/questions/:id
async function updateQuestion(req, res, next) {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!question) return error(res, 404, 'السؤال غير موجود.');
    return success(res, 200, 'تم تحديث السؤال بنجاح.', { question });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/questions/:id
async function deleteQuestion(req, res, next) {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return error(res, 404, 'السؤال غير موجود.');
    return success(res, 200, 'تم حذف السؤال.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getQuestions,
  getAdminQuestions,
  getAdminQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};
