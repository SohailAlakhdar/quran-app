import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Achievement } from '../models/achievement.model';

@Injectable({ providedIn: 'root' })
export class AchievementService {
  private readonly apiUrl = `${environment.apiUrl}/achievements`;

  constructor(private http: HttpClient) {}

  getAchievements(): Observable<ApiResponse<{ achievements: Achievement[] }>> {
    return this.http.get<ApiResponse<{ achievements: Achievement[] }>>(this.apiUrl);
  }
}
