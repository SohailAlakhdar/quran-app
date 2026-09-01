const express = require('express');
const { getSurahs, getSurahById } = require('../controllers/surah.controller');

const router = express.Router();

router.get('/', getSurahs);
router.get('/:id', getSurahById);

module.exports = router;
