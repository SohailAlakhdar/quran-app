import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStatistics } from '../../../core/services/admin.service';
import { AdminSidebarComponent } from '../../../layout/sidebar/sidebar.component';

@Component({
  selector: 'app-admin-statistics',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <h3 class="fw-bold mb-4">الإحصائيات</h3>

        @if (stats(); as s) {
          <div class="row g-3 mb-4">
            <div class="col-6 col-md-3"><div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalChildren }}</div><div class="text-muted small">الأطفال</div></div></div>
            <div class="col-6 col-md-3"><div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalQuestions }}</div><div class="text-muted small">الأسئلة</div></div></div>
            <div class="col-6 col-md-3"><div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.totalSurahs }}</div><div class="text-muted small">السور</div></div></div>
            <div class="col-6 col-md-3"><div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ s.averageScore }}%</div><div class="text-muted small">متوسط النتائج</div></div></div>
          </div>

          <div class="row g-4">
            <div class="col-md-6">
              <div class="card card-app p-4">
                <h6 class="fw-bold mb-3">أكثر السور ممارسة</h6>
                <ul class="list-group list-group-flush">
                  @for (item of s.mostPracticedSurahs; track item.surah.number) {
                    <li class="list-group-item d-flex justify-content-between">
                      <span>{{ item.surah.arabicName }}</span>
                      <span class="badge bg-light text-dark border">{{ item.count }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card card-app p-4 mb-3">
                <h6 class="fw-bold mb-3">الأسئلة حسب النوع</h6>
                @for (t of s.questionsByType; track t._id) {
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ t._id === 'memorization' ? 'حفظ' : 'تدبر' }}</span>
                    <span class="fw-bold">{{ t.count }}</span>
                  </div>
                }
              </div>
              <div class="card card-app p-4">
                <h6 class="fw-bold mb-3">الاختبارات حسب النوع</h6>
                @for (t of s.quizzesByType; track t._id) {
                  <div class="d-flex justify-content-between mb-1">
                    <span>{{ t._id === 'memorization' ? 'حفظ' : 'تدبر' }}</span>
                    <span class="fw-bold">{{ t.count }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class AdminStatisticsComponent implements OnInit {
  private adminService = inject(AdminService);
  stats = signal<AdminStatistics | null>(null);

  ngOnInit(): void {
    this.adminService.getStatistics().subscribe((res) => this.stats.set(res.data));
  }
}
