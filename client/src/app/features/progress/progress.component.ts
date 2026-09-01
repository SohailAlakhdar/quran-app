import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { Progress } from '../../core/models/progress.model';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h3 class="fw-bold mb-4">تقدمي</h3>

      @if (progress(); as p) {
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ p.totalQuizzes }}</div><div class="text-muted small">الاختبارات</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ p.totalStars }}</div><div class="text-muted small">النجوم</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ p.averageScore }}%</div><div class="text-muted small">متوسط النتائج</div></div>
          </div>
          <div class="col-6 col-md-3">
            <div class="card card-app p-3 text-center"><div class="fs-3 fw-bold">{{ p.completedSurahs }}/{{ p.totalSurahs }}</div><div class="text-muted small">سور مكتملة</div></div>
          </div>
        </div>

        <div class="card card-app p-4 mb-4">
          <h6 class="fw-bold mb-3">📖 تقدم الحفظ</h6>
          <div class="progress mb-1" style="height: 14px;">
            <div class="progress-bar" role="progressbar" style="background: var(--color-emerald);" [style.width.%]="p.memorizationProgress">
              {{ p.memorizationProgress }}%
            </div>
          </div>
        </div>

        <div class="card card-app p-4 mb-4">
          <h6 class="fw-bold mb-3">💡 تقدم التدبر والمعاني</h6>
          <div class="progress mb-1" style="height: 14px;">
            <div class="progress-bar" role="progressbar" style="background: var(--color-gold);" [style.width.%]="p.tadabburProgress">
              {{ p.tadabburProgress }}%
            </div>
          </div>
        </div>

        <h5 class="fw-bold mb-3">آخر الاختبارات</h5>
        <div class="list-group">
          @for (q of p.recentQuizzes; track q.quizId) {
            <a [routerLink]="['/results', q.quizId]" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
              <span>{{ q.surah.arabicName }} · {{ q.type === 'memorization' ? 'حفظ' : 'تدبر' }}</span>
              <span class="badge bg-light text-dark border">{{ q.score }}%</span>
            </a>
          }
          @if (!p.recentQuizzes.length) {
            <p class="text-muted">لا توجد اختبارات مكتملة بعد.</p>
          }
        </div>
      }
    </div>
  `
})
export class ProgressComponent implements OnInit {
  private progressService = inject(ProgressService);
  progress = signal<Progress | null>(null);

  ngOnInit(): void {
    this.progressService.getProgress().subscribe((res) => this.progress.set(res.data));
  }
}
