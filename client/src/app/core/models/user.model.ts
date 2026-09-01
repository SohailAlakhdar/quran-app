export type UserRole = 'child' | 'admin';

export interface User {
  _id: string;
  firstName: string;
  role: UserRole;
  stars: number;
  totalQuizzes: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  averageScore: number;
  createdAt: string;
  lastActivity?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
