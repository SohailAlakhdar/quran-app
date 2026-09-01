import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container" style="max-width: 500px;">
      <h3 class="fw-bold mb-4">حسابي</h3>
      @if (auth.currentUser(); as user) {
        <div class="card card-app p-4 text-center">
          <div class="fs-1 mb-2">🧒</div>
          <h4 class="fw-bold">{{ user.firstName }}</h4>
          <p class="text-muted">عضو منذ {{ user.createdAt | date: 'longDate' }}</p>
          <hr>
          <div class="row text-center g-3">
            <div class="col-4">
              <div class="fw-bold fs-4">{{ user.stars }}</div>
              <div class="small text-muted">نجوم</div>
            </div>
            <div class="col-4">
              <div class="fw-bold fs-4">{{ user.totalQuizzes }}</div>
              <div class="small text-muted">اختبارات</div>
            </div>
            <div class="col-4">
              <div class="fw-bold fs-4">{{ user.averageScore }}%</div>
              <div class="small text-muted">متوسط</div>
            </div>
          </div>
          <button class="btn btn-outline-danger mt-4" (click)="onLogout()">تسجيل الخروج</button>
        </div>
      }
    </div>
  `
})
export class ProfileComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
