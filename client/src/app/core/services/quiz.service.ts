import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { QuestionType } from '../models/question.model';
import { QuizResult, QuizReviewItem, StartQuizResponse, SubmitAnswerResponse } from '../models/quiz.model';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly apiUrl = `${environment.apiUrl}/quizzes`;

  // The backend has no "get quiz by id" endpoint (questions are only
  // returned once, from /start, to avoid re-exposing them). We keep the
  // in-progress quiz's questions here so the Quiz page can read them
  // after routing to /quiz/:quizId.
  readonly currentQuiz = signal<StartQuizResponse | null>(null);

  constructor(private http: HttpClient) {}

  startQuiz(surahId: string, type: QuestionType): Observable<ApiResponse<StartQuizResponse>> {
    return this.http
      .post<ApiResponse<StartQuizResponse>>(`${this.apiUrl}/start`, { surahId, type })
      .pipe(tap((res) => this.currentQuiz.set(res.data)));
  }

  submitAnswer(quizId: string, questionId: string, selectedAnswer: number): Observable<ApiResponse<SubmitAnswerResponse>> {
    return this.http.post<ApiResponse<SubmitAnswerResponse>>(`${this.apiUrl}/${quizId}/answer`, {
      questionId,
      selectedAnswer
    });
  }

  getResult(quizId: string): Observable<ApiResponse<QuizResult>> {
    return this.http.get<ApiResponse<QuizResult>>(`${this.apiUrl}/${quizId}/result`);
  }

  getReview(quizId: string): Observable<ApiResponse<{ review: QuizReviewItem[] }>> {
    return this.http.get<ApiResponse<{ review: QuizReviewItem[] }>>(`${this.apiUrl}/${quizId}/review`);
  }
}
