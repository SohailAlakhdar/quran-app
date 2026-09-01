import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { AuthResponse, User } from '../models/user.model';

const TOKEN_KEY = 'quran_app_token';
const USER_KEY = 'quran_app_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private currentUserSignal = signal<User | null>(this.readStoredUser());

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');

  constructor(private http: HttpClient) {}

  private readStoredUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  }

  signup(firstName: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/signup`, { firstName, password })
      .pipe(tap((res) => this.persistSession(res.data)));
  }

  login(firstName: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http
      .post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { firstName, password })
      .pipe(tap((res) => this.persistSession(res.data)));
  }

  fetchMe(): Observable<ApiResponse<{ user: User }>> {
    return this.http
      .get<ApiResponse<{ user: User }>>(`${this.apiUrl}/me`)
      .pipe(tap((res) => this.setUser(res.data.user)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private persistSession(data: AuthResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    this.setUser(data.user);
  }

  private setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }
}
