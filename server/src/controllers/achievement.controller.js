const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const { success } = require('../utils/apiResponse');

// GET /api/achievements
async function getAchievements(req, res, next) {
  try {
    const [achievements, unlocked] = await Promise.all([
      Achievement.find(),
      UserAchievement.find({ user: req.user._id })
    ]);

    const unlockedMap = {};
    unlocked.forEach((u) => { unlockedMap[String(u.achievement)] = u.unlockedAt; });

    const result = achievements.map((a) => ({
      id: a._id,
      name: a.name,
      description: a.description,
      icon: a.icon,
      unlocked: Boolean(unlockedMap[String(a._id)]),
      unlockedAt: unlockedMap[String(a._id)] || null
    }));

    return success(res, 200, 'تم جلب الإنجازات بنجاح.', { achievements: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAchievements };
