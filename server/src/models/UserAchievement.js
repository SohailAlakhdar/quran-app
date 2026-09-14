const mongoose = require('mongoose');

const userAchievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    achievement: { type: mongoose.Schema.Types.ObjectId, ref: 'Achievement', required: true },
    unlockedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

userAchievementSchema.index({ surah: 1, type: 1, isActive: 1 });
function hideInactiveByDefault(next) {
  const options = this.getOptions();
  if (!options.includeInactive && this.getFilter().isActive === undefined) {
    this.where({ isActive: true });
  }
  next();
}

userAchievementSchema.pre('find', hideInactiveByDefault);
userAchievementSchema.pre('findOne', hideInactiveByDefault);
userAchievementSchema.pre('countDocuments', hideInactiveByDefault);

module.exports = mongoose.model('UserAchievement', userAchievementSchema);
