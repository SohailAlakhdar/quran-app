const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { getProgress } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', protect, getProgress);

module.exports = router;
