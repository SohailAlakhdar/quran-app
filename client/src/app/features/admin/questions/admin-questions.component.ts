import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { SurahService } from '../../../core/services/surah.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminSidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { AdminQuestion } from '../../../core/models/question.model';
import { Surah } from '../../../core/models/surah.model';
import { Paginated } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-admin-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0">إدارة الأسئلة</h3>
          <a routerLink="/admin/questions/add" class="btn btn-emerald"><i class="bi bi-plus-lg me-1"></i> إضافة سؤال</a>
        </div>

        <div class="row g-2 mb-3">
          <div class="col-md-4">
            <input type="text" class="form-control" placeholder="ابحث في نص السؤال..." [(ngModel)]="search" (ngModelChange)="reload()">
          </div>
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="surahFilter" (ngModelChange)="reload()">
              <option value="">كل السور</option>
              @for (s of surahs(); track s._id) {
                <option [value]="s._id">{{ s.arabicName }}</option>
              }
            </select>
          </div>
          <div class="col-md-2">
            <select class="form-select" [(ngModel)]="typeFilter" (ngModelChange)="reload()">
              <option value="">كل الأنواع</option>
              <option value="memorization">حفظ</option>
              <option value="tadabbur">تدبر</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" [(ngModel)]="difficultyFilter" (ngModelChange)="reload()">
              <option value="">كل المستويات</option>
              <option value="easy">سهل</option>
              <option value="medium">متوسط</option>
              <option value="hard">صعب</option>
            </select>
          </div>
        </div>

        <div class="card card-app p-0">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th>السؤال</th>
                <th>السورة</th>
                <th>النوع</th>
                <th>الصعوبة</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (q of questions(); track q._id) {
                <tr>
                  <td style="max-width: 320px;">{{ q.text }}</td>
                  <td>{{ surahName(q) }}</td>
                  <td>{{ q.type === 'memorization' ? 'حفظ' : 'تدبر' }}</td>
                  <td><span class="badge bg-secondary">{{ difficultyLabel(q.difficulty) }}</span></td>
                  <td>
                    @if (q.isActive) {
                      <span class="badge bg-success">فعال</span>
                    } @else {
                      <span class="badge bg-secondary">غير فعال</span>
                    }
                  </td>
                  <td>
                    <a [routerLink]="['/admin/questions', q._id, 'edit']" class="btn btn-sm btn-outline-primary me-1"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-sm btn-outline-danger" (click)="remove(q)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (pagination(); as p) {
          <nav class="mt-3">
            <ul class="pagination justify-content-center">
              @for (pg of pageNumbers(); track pg) {
                <li class="page-item" [class.active]="pg === p.page">
                  <button class="page-link" (click)="goToPage(pg)">{{ pg }}</button>
                </li>
              }
            </ul>
          </nav>
        }
      </div>
    </div>
  `
})
export class AdminQuestionsComponent implements OnInit {
  private adminService = inject(AdminService);
  private surahService = inject(SurahService);
  private toast = inject(ToastService);

  questions = signal<AdminQuestion[]>([]);
  surahs = signal<Surah[]>([]);
  pagination = signal<Paginated<AdminQuestion>['pagination'] | null>(null);

  search = '';
  surahFilter = '';
  typeFilter = '';
  difficultyFilter = '';
  page = 1;

  ngOnInit(): void {
    this.surahService.getSurahs().subscribe((res) => this.surahs.set(res.data.surahs));
    this.reload();
  }

  surahName(q: AdminQuestion): string {
    if (typeof q.surah === 'string') return '';
    return q.surah?.arabicName || '';
  }

  difficultyLabel(d: string): string {
    return d === 'easy' ? 'سهل' : d === 'hard' ? 'صعب' : 'متوسط';
  }

  reload(): void {
    this.page = 1;
    this.fetch();
  }

  fetch(): void {
    this.adminService
      .getQuestions({
        page: this.page,
        limit: 10,
        surah: this.surahFilter,
        type: this.typeFilter,
        difficulty: this.difficultyFilter,
        search: this.search
      })
      .subscribe((res) => {
        this.questions.set(res.data.data);
        this.pagination.set(res.data.pagination);
      });
  }

  pageNumbers(): number[] {
    const total = this.pagination()?.totalPages || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(pg: number): void {
    this.page = pg;
    this.fetch();
  }

  remove(q: AdminQuestion): void {
    if (!confirm('هل تريد حذف هذا السؤال؟')) return;
    this.adminService.deleteQuestion(q._id).subscribe(() => {
      this.toast.success('تم حذف السؤال.');
      this.fetch();
    });
  }
}
