const { body } = require('express-validator');

const surahValidator = [
  body('number').isInt({ min: 1, max: 114 }).withMessage('رقم السورة غير صالح'),
  body('name').trim().notEmpty().withMessage('اسم السورة مطلوب'),
  body('arabicName').trim().notEmpty().withMessage('الاسم بالعربية مطلوب'),
  body('ayahCount').isInt({ min: 1 }).withMessage('عدد الآيات غير صالح'),
  body('juz').isInt({ min: 1, max: 30 }).withMessage('رقم الجزء غير صالح'),
  body('quizQuestionCount').optional().isInt({ min: 1 }).withMessage('عدد أسئلة الاختبار غير صالح')
];

module.exports = { surahValidator };
