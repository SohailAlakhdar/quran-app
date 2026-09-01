const Surah = require('../models/Surah');
const { success, error } = require('../utils/apiResponse');

// GET /api/surahs
async function getSurahs(req, res, next) {
  try {
    const surahs = await Surah.find().sort({ number: 1 });
    return success(res, 200, 'تم جلب السور بنجاح.', { surahs });
  } catch (err) {
    next(err);
  }
}

// GET /api/surahs/:id
async function getSurahById(req, res, next) {
  try {
    const surah = await Surah.findById(req.params.id);
    if (!surah) return error(res, 404, 'السورة غير موجودة.');
    return success(res, 200, 'تم جلب السورة بنجاح.', { surah });
  } catch (err) {
    next(err);
  }
}

// POST /api/admin/surahs
async function createSurah(req, res, next) {
  try {
    const surah = await Surah.create(req.body);
    return success(res, 201, 'تم إضافة السورة بنجاح.', { surah });
  } catch (err) {
    next(err);
  }
}

// PUT /api/admin/surahs/:id
async function updateSurah(req, res, next) {
  try {
    const surah = await Surah.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!surah) return error(res, 404, 'السورة غير موجودة.');
    return success(res, 200, 'تم تحديث السورة بنجاح.', { surah });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/surahs/:id
async function deleteSurah(req, res, next) {
  try {
    const surah = await Surah.findByIdAndDelete(req.params.id);
    if (!surah) return error(res, 404, 'السورة غير موجودة.');
    return success(res, 200, 'تم حذف السورة بنجاح.');
  } catch (err) {
    next(err);
  }
}

module.exports = { getSurahs, getSurahById, createSurah, updateSurah, deleteSurah };
