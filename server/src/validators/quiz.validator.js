const { body } = require('express-validator');

const startQuizValidator = [
  body('surahId').isMongoId().withMessage('السورة غير صالحة'),
  body('type').isIn(['memorization', 'tadabbur']).withMessage('نوع التدريب غير صالح')
];

const submitAnswerValidator = [
  body('questionId').isMongoId().withMessage('السؤال غير صالح'),
  body('selectedAnswer').isInt({ min: 0, max: 3 }).withMessage('الإجابة المختارة غير صالحة')
];

module.exports = { startQuizValidator, submitAnswerValidator };
