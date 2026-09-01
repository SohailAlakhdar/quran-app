const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { startQuizValidator, submitAnswerValidator } = require('../validators/quiz.validator');
const { startQuiz, submitAnswer, getResult, getReview } = require('../controllers/quiz.controller');

const router = express.Router();

router.post('/start', protect, startQuizValidator, validate, startQuiz);
router.post('/:quizId/answer', protect, submitAnswerValidator, validate, submitAnswer);
router.get('/:quizId/result', protect, getResult);
router.get('/:quizId/review', protect, getReview);

module.exports = router;
