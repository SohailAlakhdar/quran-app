/**
 * Database seed script.
 *
 * IMPORTANT: The sample questions below are clearly marked DEMO content.
 * They are intentionally simple placeholders and MUST be reviewed/replaced
 * by a qualified admin with verified Quranic content before real use.
 * No fake Quran verses or fake ayah meanings are generated here.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Surah = require('../models/Surah');
const Question = require('../models/Question');
const Achievement = require('../models/Achievement');
const UserAchievement = require('../models/UserAchievement');
const Quiz = require('../models/Quiz');

const surahsData = [
  { number: 114, name: 'An-Nas', arabicName: 'سورة الناس', ayahCount: 6, juz: 30, quizQuestionCount: 5 },
  { number: 113, name: 'Al-Falaq', arabicName: 'سورة الفلق', ayahCount: 5, juz: 30, quizQuestionCount: 5 },
  { number: 112, name: 'Al-Ikhlas', arabicName: 'سورة الإخلاص', ayahCount: 4, juz: 30, quizQuestionCount: 4 },
  { number: 111, name: 'Al-Masad', arabicName: 'سورة المسد', ayahCount: 5, juz: 30, quizQuestionCount: 5 },
  { number: 108, name: 'Al-Kawthar', arabicName: 'سورة الكوثر', ayahCount: 3, juz: 30, quizQuestionCount: 3 },
  { number: 105, name: 'Al-Fil', arabicName: 'سورة الفيل', ayahCount: 5, juz: 30, quizQuestionCount: 5 },
  { number: 103, name: 'Al-Asr', arabicName: 'سورة العصر', ayahCount: 3, juz: 30, quizQuestionCount: 3 },
  { number: 91, name: 'Ash-Shams', arabicName: 'سورة الشمس', ayahCount: 15, juz: 30, quizQuestionCount: 5 }
];

const achievementsData = [
  { name: 'أول اختبار', description: 'أكملت أول اختبار لك!', icon: '🏆', condition: { type: 'first_quiz', value: 1 } },
  { name: '10 إجابات صحيحة', description: 'أجبت 10 إجابات صحيحة بشكل صحيح.', icon: '⭐', condition: { type: 'correct_answers_total', value: 10 } },
  { name: 'سورة مكتملة', description: 'أكملت سورة كاملة (حفظ وتدبر).', icon: '📖', condition: { type: 'surah_completed', value: 1 } },
  { name: '5 تدريبات متتالية', description: 'أكملت 5 اختبارات.', icon: '🔥', condition: { type: 'consecutive_quizzes', value: 5 } },
  { name: 'نجم القرآن', description: 'جمعت 50 نجمة!', icon: '🌟', condition: { type: 'stars_total', value: 50 } }
];

// DEMO / SAMPLE questions only — for testing the quiz engine and random
// selection logic. Replace with verified content before production use.
function buildDemoQuestions(surah) {
  const questions = [];
  const types = ['memorization', 'tadabbur'];

  for (const type of types) {
    for (let i = 1; i <= 6; i += 1) {
      const correctIndex = (i - 1) % 4;
      const options = [0, 1, 2, 3].map((idx) => ({
        text: idx === correctIndex
          ? `[نموذج] الإجابة الصحيحة رقم ${i} لسورة ${surah.arabicName}`
          : `[نموذج] خيار تجريبي ${idx + 1} - سؤال ${i}`
      }));

      questions.push({
        surah: surah._id,
        type,
        text: `[سؤال تجريبي ${type === 'memorization' ? 'حفظ' : 'تدبر'} #${i}] عن ${surah.arabicName} — يجب استبداله بمحتوى معتمد.`,
        options,
        correctAnswer: correctIndex,
        explanation: `هذا شرح تجريبي للسؤال رقم ${i} في ${surah.arabicName}. يرجى استبداله بمحتوى موثوق.`,
        difficulty: ['easy', 'medium', 'hard'][i % 3],
        isActive: true
      });
    }
  }
  return questions;
}

async function seed() {
  await connectDB();

  console.log('[SEED] Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Surah.deleteMany({}),
    Question.deleteMany({}),
    Achievement.deleteMany({}),
    UserAchievement.deleteMany({}),
    Quiz.deleteMany({})
  ]);

  console.log('[SEED] Creating admin account...');
  await User.create({
    firstName: 'Admin',
    password: 'Admin@1234',
    role: 'admin'
  });

  console.log('[SEED] Creating surahs...');
  const surahs = await Surah.insertMany(surahsData);

  console.log('[SEED] Creating demo questions...');
  let allQuestions = [];
  for (const surah of surahs) {
    allQuestions = allQuestions.concat(buildDemoQuestions(surah));
  }
  await Question.insertMany(allQuestions);

  console.log('[SEED] Creating achievements...');
  await Achievement.insertMany(achievementsData);

  console.log('[SEED] Done!');
  console.log('----------------------------------------');
  console.log('Admin login -> firstName: Admin, password: Admin@1234');
  console.log(`Seeded ${surahs.length} surahs and ${allQuestions.length} demo questions.`);
  console.log('----------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED] Failed:', err);
  process.exit(1);
});
