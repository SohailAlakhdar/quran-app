const express = require('express');
const rateLimit = require('express-rate-limit');
const { signup, login, me, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { signupValidator, loginValidator } = require('../validators/auth.validator');

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'محاولات كثيرة جداً، حاول لاحقاً.', errors: [] }
});

router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', protect, me);
router.post('/logout', protect, logout);

module.exports = router;
