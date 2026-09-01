export interface RecentQuiz {
  quizId: string;
  surah: { name: string; arabicName: string; number: number };
  type: 'memorization' | 'tadabbur';
  score: number;
  starsEarned: number;
  completedAt: string;
}

export interface Progress {
  totalQuizzes: number;
  totalStars: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  averageScore: number;
  completedSurahs: number;
  totalSurahs: number;
  memorizationProgress: number;
  tadabburProgress: number;
  recentQuizzes: RecentQuiz[];
}
