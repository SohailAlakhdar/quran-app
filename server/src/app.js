const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const authRoutes = require('./routes/auth.routes');
const surahRoutes = require('./routes/surah.routes');
const questionRoutes = require('./routes/question.routes');
const quizRoutes = require('./routes/quiz.routes');
const userRoutes = require('./routes/user.routes');
const achievementRoutes = require('./routes/achievement.routes');
const adminRoutes = require('./routes/admin.routes');

const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'الخادم يعمل بنجاح.', data: { status: 'ok' } });
});

app.use('/api/auth', authRoutes);
app.use('/api/surahs', surahRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', userRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
