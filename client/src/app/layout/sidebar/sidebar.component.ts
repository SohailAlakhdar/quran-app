import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar-admin py-4 d-flex flex-column">
      <div class="px-4 mb-4 text-white">
        <h5 class="fw-bold mb-0"><i class="bi bi-shield-lock-fill me-2"></i>لوحة الإدارة</h5>
      </div>
      <nav class="flex-grow-1">
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
          <i class="bi bi-speedometer2 me-2"></i> الرئيسية
        </a>
        <a routerLink="/admin/questions" routerLinkActive="active">
          <i class="bi bi-patch-question-fill me-2"></i> الأسئلة
        </a>
        <a routerLink="/admin/surahs" routerLinkActive="active">
          <i class="bi bi-book-fill me-2"></i> السور
        </a>
        <a routerLink="/admin/users" routerLinkActive="active">
          <i class="bi bi-people-fill me-2"></i> الأطفال
        </a>
        <a routerLink="/admin/statistics" routerLinkActive="active">
          <i class="bi bi-bar-chart-fill me-2"></i> الإحصائيات
        </a>
      </nav>
      <div class="px-3">
        <button class="btn btn-outline-light w-100" (click)="onLogout()">
          <i class="bi bi-box-arrow-right me-2"></i> تسجيل الخروج
        </button>
      </div>
    </div>
  `
})
export class AdminSidebarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
