const { body } = require('express-validator');

const questionValidator = [
  body('surah').isMongoId().withMessage('السورة غير صالحة'),
  body('type').isIn(['memorization', 'tadabbur']).withMessage('نوع التدريب غير صالح'),
  body('text').trim().notEmpty().withMessage('نص السؤال مطلوب'),
  body('options')
    .isArray({ min: 4, max: 4 }).withMessage('يجب إدخال أربعة خيارات بالضبط'),
  body('options.*.text').trim().notEmpty().withMessage('نص الخيار مطلوب'),
  body('correctAnswer')
    .isInt({ min: 0, max: 3 }).withMessage('يجب اختيار إجابة صحيحة واحدة (0-3)'),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('مستوى الصعوبة غير صالح'),
  body('explanation').optional().trim()
];

module.exports = { questionValidator };
