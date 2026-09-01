const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    selectedAnswer: { type: Number, required: true, min: 0, max: 3 },
    isCorrect: { type: Boolean, required: true },
    answeredAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    surah: { type: mongoose.Schema.Types.ObjectId, ref: 'Surah', required: true, index: true },
    type: { type: String, enum: ['memorization', 'tadabbur'], required: true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    currentQuestion: { type: Number, default: 0 },
    answers: [answerSchema],
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    starsEarned: { type: Number, default: 0 },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress', index: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

quizSchema.index({ user: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Quiz', quizSchema);
