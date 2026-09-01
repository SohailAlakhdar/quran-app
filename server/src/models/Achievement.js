const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: '🏆' },
    condition: {
      type: {
        type: String,
        enum: ['first_quiz', 'correct_answers_total', 'surah_completed', 'consecutive_quizzes', 'stars_total'],
        required: true
      },
      value: { type: Number, default: 1 }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
