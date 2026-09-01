import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/api-response.model';
import { AdminQuestion } from '../models/question.model';
import { Surah } from '../models/surah.model';

export interface AdminStatistics {
  totalChildren: number;
  totalQuestions: number;
  totalSurahs: number;
  totalQuizzes: number;
  averageScore: number;
  mostPracticedSurahs: { surah: { name: string; arabicName: string; number: number }; count: number }[];
  questionsByType: { _id: string; count: number }[];
  quizzesByType: { _id: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Statistics
  getStatistics() {
    return this.http.get<ApiResponse<AdminStatistics>>(`${this.apiUrl}/statistics`);
  }

  // Questions
  getQuestions(filters: { page?: number; limit?: number; surah?: string; type?: string; difficulty?: string; search?: string } = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params = params.set(k, v as any); });
    return this.http.get<ApiResponse<Paginated<AdminQuestion>>>(`${this.apiUrl}/questions`, { params });
  }

  getQuestionById(id: string) {
    return this.http.get<ApiResponse<{ question: AdminQuestion }>>(`${this.apiUrl}/questions/${id}`);
  }

  createQuestion(payload: Partial<AdminQuestion>) {
    return this.http.post<ApiResponse<{ question: AdminQuestion }>>(`${this.apiUrl}/questions`, payload);
  }

  updateQuestion(id: string, payload: Partial<AdminQuestion>) {
    return this.http.put<ApiResponse<{ question: AdminQuestion }>>(`${this.apiUrl}/questions/${id}`, payload);
  }

  deleteQuestion(id: string) {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/questions/${id}`);
  }

  // Surahs
  createSurah(payload: Partial<Surah>) {
    return this.http.post<ApiResponse<{ surah: Surah }>>(`${this.apiUrl}/surahs`, payload);
  }

  updateSurah(id: string, payload: Partial<Surah>) {
    return this.http.put<ApiResponse<{ surah: Surah }>>(`${this.apiUrl}/surahs/${id}`, payload);
  }

  deleteSurah(id: string) {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/surahs/${id}`);
  }
}
