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
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
// hook in searching
achievementSchema.index({ isActive: 1 });
function hideInactiveByDefault(next) {
  const options = this.getOptions();
  if (!options.includeInactive && this.getFilter().isActive === undefined) {
    this.where({ isActive: true });
  }
  next();
}

achievementSchema.pre('find', hideInactiveByDefault);
achievementSchema.pre('findOne', hideInactiveByDefault);
achievementSchema.pre('countDocuments', hideInactiveByDefault);

module.exports = mongoose.model('Achievement', achievementSchema);
