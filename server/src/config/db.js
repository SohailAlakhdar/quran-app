const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/quran-learning';
  try {
    await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${mongoose.connection.host}`);

    // لازم تلاقي: firstName_1: [ [ 'firstName', 1 ] ]
    const indexes = await User.collection.listIndexes().toArray();
    console.log(indexes);
  } catch (err) {
    console.error('[DB] Connection error:', err.message);
    process.exit(1);
  }
}

const UserAchievement = require('./../models/UserAchievement.js'); // عدّل المسار
const User = require('../models/User.js');

async function activateAllSurahs() {
  await mongoose.connect(process.env.MONGO_URI);

  const result = await UserAchievement.updateMany(
    {},
    { $set: { isActive: true } }
  );

  console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  await mongoose.disconnect();
}

// activateAllSurahs().catch(console.error);
module.exports = connectDB;
