const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getQuestions } = require('../controllers/question.controller');

const router = express.Router();

router.get('/', protect, getQuestions);

module.exports = router;
