const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getAchievements } = require('../controllers/achievement.controller');

const router = express.Router();

router.get('/', protect, getAchievements);

module.exports = router;
