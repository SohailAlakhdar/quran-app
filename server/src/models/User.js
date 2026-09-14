const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'الاسم الثلاثي مطلوب'],
      trim: true,
      minlength: 2,
      maxlength: 50,
      unique: true
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
    lastActivity: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

// Kept for sorting/pagination performance (e.g. admin user lists);
// uniqueness itself is enforced by the `unique: true` on firstName above.
userSchema.index({ firstName: 1, createdAt: -1 });

/**
 * Auto-hide inactive (soft-deleted / deactivated) users from every
 * find/findOne/count query by default. This also means a deactivated
 * user can no longer log in (login queries via findOne) and any
 * existing token becomes invalid (the auth middleware looks the user
 * up via findById on every request). Pass `{ includeInactive: true }`
 * as a query option to bypass this (used by admin management screens).
 */
function hideInactiveByDefault(next) {
  const options = this.getOptions();
  if (!options.includeInactive && this.getFilter().isActive === undefined) {
    this.where({ isActive: true });
  }
  next();
}

userSchema.pre('find', hideInactiveByDefault);
userSchema.pre('findOne', hideInactiveByDefault);
userSchema.pre('countDocuments', hideInactiveByDefault);

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