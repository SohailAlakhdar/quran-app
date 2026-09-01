const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'الاسم الأول مطلوب'],
      trim: true,
      minlength: 2,
      maxlength: 50,
      index: true
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: 4,
      select: false
    },
    role: {
      type: String,
      enum: ['child', 'admin'],
      default: 'child'
    },
    stars: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalQuestionsAnswered: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Non-unique index to speed up lookups; firstName is not required to be
// globally unique since children may share the same first name.
userSchema.index({ firstName: 1, createdAt: -1 });

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
