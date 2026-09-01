const { body } = require('express-validator');

const signupValidator = [
  body('firstName')
    .trim()
    .notEmpty().withMessage('الاسم الأول مطلوب')
    .isLength({ min: 2, max: 50 }).withMessage('الاسم يجب أن يكون بين 2 و 50 حرفاً'),
  body('password')
    .notEmpty().withMessage('كلمة المرور مطلوبة')
    .isLength({ min: 4 }).withMessage('كلمة المرور يجب أن تكون 4 أحرف على الأقل')
];

const loginValidator = [
  body('firstName').trim().notEmpty().withMessage('الاسم الأول مطلوب'),
  body('password').notEmpty().withMessage('كلمة المرور مطلوبة')
];

module.exports = { signupValidator, loginValidator };
