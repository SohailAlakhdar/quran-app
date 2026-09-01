const mongoose = require('mongoose');

const surahSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true, min: 1, max: 114 },
    name: { type: String, required: true, trim: true },
    arabicName: { type: String, required: true, trim: true },
    ayahCount: { type: Number, required: true, min: 1 },
    juz: { type: Number, required: true, min: 1, max: 30 },
    quizQuestionCount: { type: Number, required: true, default: 5, min: 1 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Surah', surahSchema);
