import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AdminService, AdminStatistics } from '../../../core/services/admin.service';
import { AdminSidebarComponent } from '../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <h3 class="fw-bold mb-4">لوحة التحكم</h3>

        @if (stats(); as s) {
          <div class="row g-3">
            <div class="col-6 col-md-3">
              <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalChildren }}</div><div class="text-muted small">الأطفال</div></div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalQuestions }}</div><div class="text-muted small">الأسئلة</div></div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalSurahs }}</div><div class="text-muted small">السور</div></div>
            </div>
            <div class="col-6 col-md-3">
              <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalQuizzes }}</div><div class="text-muted small">الاختبارات</div></div>
            </div>
          </div>
        }

        <div class="row g-3 mt-1">
          <div class="col-md-4">
            <a routerLink="/admin/questions" class="card card-app p-4 text-decoration-none text-dark d-block">
              <i class="bi bi-patch-question-fill fs-2 mb-2" style="color: var(--color-emerald);"></i>
              <h6 class="fw-bold">إدارة الأسئلة</h6>
            </a>
          </div>
          <div class="col-md-4">
            <a routerLink="/admin/surahs" class="card card-app p-4 text-decoration-none text-dark d-block">
              <i class="bi bi-book-fill fs-2 mb-2" style="color: var(--color-emerald);"></i>
              <h6 class="fw-bold">إدارة السور</h6>
            </a>
          </div>
          <div class="col-md-4">
            <a routerLink="/admin/users" class="card card-app p-4 text-decoration-none text-dark d-block">
              <i class="bi bi-people-fill fs-2 mb-2" style="color: var(--color-emerald);"></i>
              <h6 class="fw-bold">إدارة الأطفال</h6>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<AdminStatistics | null>(null);

  ngOnInit(): void {
    this.adminService.getStatistics().subscribe((res) => this.stats.set(res.data));
  }
}
