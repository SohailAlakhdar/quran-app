import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Progress } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly apiUrl = `${environment.apiUrl}/progress`;

  constructor(private http: HttpClient) {}

  getProgress(): Observable<ApiResponse<Progress>> {
    return this.http.get<ApiResponse<Progress>>(this.apiUrl);
  }
}
