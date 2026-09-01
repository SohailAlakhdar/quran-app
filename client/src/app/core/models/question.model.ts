export type QuestionType = 'memorization' | 'tadabbur';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  text: string;
}

// Child-facing question: never contains the correct answer.
export interface PublicQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  difficulty: Difficulty;
}

// Admin-facing question: includes correctAnswer.
export interface AdminQuestion {
  _id: string;
  surah: { _id: string; name: string; arabicName: string; number: number } | string;
  type: QuestionType;
  text: string;
  options: QuestionOption[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  isActive: boolean;
  createdAt?: string;
}
