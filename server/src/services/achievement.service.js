const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

/**
 * Evaluate all achievement conditions for a user and unlock any newly
 * satisfied achievements. Duplicate unlocks are prevented via the unique
 * (user, achievement) index on UserAchievement.
 */
async function checkAndUnlockAchievements(userId) {
  const user = await User.findById(userId);
  if (!user) return [];

  const achievements = await Achievement.find();
  const alreadyUnlocked = await UserAchievement.find({ user: userId }).select('achievement');
  const unlockedIds = new Set(alreadyUnlocked.map((a) => String(a.achievement)));

  const newlyUnlocked = [];

  for (const achievement of achievements) {
    if (unlockedIds.has(String(achievement._id))) continue;

    const satisfied = await evaluateCondition(userId, user, achievement.condition);
    if (satisfied) {
      try {
        await UserAchievement.create({ user: userId, achievement: achievement._id });
        newlyUnlocked.push(achievement);
      } catch (err) {
        // Ignore duplicate-key races; the unique index protects us.
        if (err.code !== 11000) throw err;
      }
    }
  }

  return newlyUnlocked;
}

async function evaluateCondition(userId, user, condition) {
  switch (condition.type) {
    case 'first_quiz':
      return user.totalQuizzes >= (condition.value || 1);

    case 'correct_answers_total':
      return user.totalCorrectAnswers >= condition.value;

    case 'stars_total':
      return user.stars >= condition.value;

    case 'surah_completed': {
      // A surah counts as "completed" once the user has finished at least
      // one quiz of each type (memorization + tadabbur) for that surah,
      // for at least `condition.value` distinct surahs.
      const completedQuizzes = await Quiz.find({ user: userId, status: 'completed' }).select('surah type');
      const bySurah = {};
      for (const q of completedQuizzes) {
        const key = String(q.surah);
        if (!bySurah[key]) bySurah[key] = new Set();
        bySurah[key].add(q.type);
      }
      const completedSurahs = Object.values(bySurah).filter((types) => types.has('memorization') && types.has('tadabbur'));
      return completedSurahs.length >= (condition.value || 1);
    }

    case 'consecutive_quizzes':
      return user.totalQuizzes >= condition.value;

    default:
      return false;
  }
}

module.exports = { checkAndUnlockAchievements };
