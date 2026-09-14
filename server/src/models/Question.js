const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema(
  { text: { type: String, required: true, trim: true } },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    surah: { type: mongoose.Schema.Types.ObjectId, ref: 'Surah', required: true, index: true },
    type: {
      type: String,
      enum: ['memorization', 'tadabbur'],
      required: true,
      index: true
    },
    text: { type: String, required: true, trim: true },
    options: {
      type: [optionSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 4,
        message: 'يجب أن يحتوي السؤال على أربعة خيارات بالضبط'
      }
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    explanation: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

questionSchema.index({ surah: 1, type: 1, isActive: 1 });
function hideInactiveByDefault(next) {
  const options = this.getOptions();
  if (!options.includeInactive && this.getFilter().isActive === undefined) {
    this.where({ isActive: true });
  }
  next();
}

questionSchema.pre('find', hideInactiveByDefault);
questionSchema.pre('findOne', hideInactiveByDefault);
questionSchema.pre('countDocuments', hideInactiveByDefault);
module.exports = mongoose.model('Question', questionSchema);
