import { PublicQuestion, QuestionType } from './question.model';

export interface StartQuizResponse {
  quizId: string;
  surahId: string;
  type: QuestionType;
  totalQuestions: number;
  questions: PublicQuestion[];
}

export interface SubmitAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  explanation: string;
  starsEarned: number;
  quizCompleted: boolean;
}

export interface QuizResult {
  quizId: string;
  surah: { _id: string; name: string; arabicName: string; number: number };
  type: QuestionType;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  percentage: number;
  starsEarned: number;
  completedAt: string;
}

export interface QuizReviewItem {
  question: string;
  options: { text: string }[];
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  explanation: string;
}
