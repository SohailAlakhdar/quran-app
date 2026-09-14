const mongoose = require('mongoose');

const surahSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true, unique: true, min: 1, max: 114 },
    name: { type: String, required: true, trim: true },
    arabicName: { type: String, required: true, trim: true },
    ayahCount: { type: Number, required: true, min: 1 },
    juz: { type: Number, required: true, min: 1, max: 30 },
    quizQuestionCount: { type: Number, required: true, default: 5, min: 1 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);
surahSchema.index({ isActive: 1 });
function hideInactiveByDefault(next) {
  const options = this.getOptions();
  if (!options.includeInactive && this.getFilter().isActive === undefined) {
    this.where({ isActive: true });
  }
  next();
}

surahSchema.pre('find', hideInactiveByDefault);
surahSchema.pre('findOne', hideInactiveByDefault);
surahSchema.pre('countDocuments', hideInactiveByDefault);
module.exports = mongoose.model('Surah', surahSchema);
