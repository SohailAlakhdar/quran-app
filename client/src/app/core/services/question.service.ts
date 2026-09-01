import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { PublicQuestion } from '../models/question.model';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly apiUrl = `${environment.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  getQuestions(filters: { surah?: string; type?: string; difficulty?: string } = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params = params.set(k, v); });
    return this.http.get<ApiResponse<{ questions: PublicQuestion[] }>>(this.apiUrl, { params });
  }
}
