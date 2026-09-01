const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');
const { validate } = require('../middleware/validate.middleware');
const { surahValidator } = require('../validators/surah.validator');
const { questionValidator } = require('../validators/question.validator');

const { createSurah, updateSurah, deleteSurah } = require('../controllers/surah.controller');
const {
  getAdminQuestions,
  getAdminQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/question.controller');
const { getStatistics, getUsers } = require('../controllers/admin.controller');

const router = express.Router();

// Every admin route requires a valid token AND the admin role.
router.use(protect, adminOnly);

// Surahs
router.post('/surahs', surahValidator, validate, createSurah);
router.put('/surahs/:id', surahValidator, validate, updateSurah);
router.delete('/surahs/:id', deleteSurah);

// Questions
router.get('/questions', getAdminQuestions);
router.post('/questions', questionValidator, validate, createQuestion);
router.get('/questions/:id', getAdminQuestionById);
router.put('/questions/:id', questionValidator, validate, updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// Users & statistics
router.get('/users', getUsers);
router.get('/statistics', getStatistics);

module.exports = router;
