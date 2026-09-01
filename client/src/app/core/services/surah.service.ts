import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Surah } from '../models/surah.model';

@Injectable({ providedIn: 'root' })
export class SurahService {
  private readonly apiUrl = `${environment.apiUrl}/surahs`;

  constructor(private http: HttpClient) {}

  getSurahs(): Observable<ApiResponse<{ surahs: Surah[] }>> {
    return this.http.get<ApiResponse<{ surahs: Surah[] }>>(this.apiUrl);
  }

  getSurahById(id: string): Observable<ApiResponse<{ surah: Surah }>> {
    return this.http.get<ApiResponse<{ surah: Surah }>>(`${this.apiUrl}/${id}`);
  }
}
