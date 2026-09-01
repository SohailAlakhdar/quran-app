import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SurahService } from '../../../core/services/surah.service';
import { AdminService } from '../../../core/services/admin.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminSidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { Surah } from '../../../core/models/surah.model';

@Component({
  selector: 'app-admin-surahs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-bold mb-0">إدارة السور</h3>
          <button class="btn btn-emerald" (click)="openAdd()"><i class="bi bi-plus-lg me-1"></i> إضافة سورة</button>
        </div>

        @if (showForm()) {
          <div class="card card-app p-4 mb-4">
            <h6 class="fw-bold mb-3">{{ editingId() ? 'تعديل سورة' : 'سورة جديدة' }}</h6>
            <form [formGroup]="form" (ngSubmit)="save()">
              <div class="row g-3">
                <div class="col-md-3">
                  <label class="form-label">الرقم</label>
                  <input type="number" class="form-control" formControlName="number">
                </div>
                <div class="col-md-3">
                  <label class="form-label">الاسم (EN)</label>
                  <input type="text" class="form-control" formControlName="name">
                </div>
                <div class="col-md-3">
                  <label class="form-label">الاسم بالعربية</label>
                  <input type="text" class="form-control" formControlName="arabicName">
                </div>
                <div class="col-md-3">
                  <label class="form-label">عدد الآيات</label>
                  <input type="number" class="form-control" formControlName="ayahCount">
                </div>
                <div class="col-md-3">
                  <label class="form-label">الجزء</label>
                  <input type="number" class="form-control" formControlName="juz">
                </div>
                <div class="col-md-3">
                  <label class="form-label">عدد أسئلة الاختبار</label>
                  <input type="number" class="form-control" formControlName="quizQuestionCount">
                </div>
              </div>
              <div class="mt-3 d-flex gap-2">
                <button type="submit" class="btn btn-emerald" [disabled]="form.invalid">حفظ</button>
                <button type="button" class="btn btn-outline-secondary" (click)="cancel()">إلغاء</button>
              </div>
            </form>
          </div>
        }

        <div class="card card-app p-0">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th>السورة</th>
                <th>الآيات</th>
                <th>عدد أسئلة الاختبار</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (s of surahs(); track s._id) {
                <tr>
                  <td>{{ s.arabicName }} <span class="text-muted small">({{ s.name }})</span></td>
                  <td>{{ s.ayahCount }}</td>
                  <td>{{ s.quizQuestionCount }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-1" (click)="openEdit(s)"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-outline-danger" (click)="remove(s)"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminSurahsComponent implements OnInit {
  private surahService = inject(SurahService);
  private adminService = inject(AdminService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  surahs = signal<Surah[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    number: [1, [Validators.required, Validators.min(1), Validators.max(114)]],
    name: ['', Validators.required],
    arabicName: ['', Validators.required],
    ayahCount: [1, [Validators.required, Validators.min(1)]],
    juz: [1, [Validators.required, Validators.min(1), Validators.max(30)]],
    quizQuestionCount: [5, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.surahService.getSurahs().subscribe((res) => this.surahs.set(res.data.surahs));
  }

  openAdd(): void {
    this.editingId.set(null);
    this.form.reset({ number: 1, name: '', arabicName: '', ayahCount: 1, juz: 1, quizQuestionCount: 5 });
    this.showForm.set(true);
  }

  openEdit(s: Surah): void {
    this.editingId.set(s._id);
    this.form.reset(s);
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const id = this.editingId();
    const req = id ? this.adminService.updateSurah(id, payload) : this.adminService.createSurah(payload);
    req.subscribe(() => {
      this.toast.success(id ? 'تم تحديث السورة بنجاح.' : 'تم إضافة السورة بنجاح.');
      this.showForm.set(false);
      this.load();
    });
  }

  remove(s: Surah): void {
    if (!confirm(`هل تريد حذف سورة ${s.arabicName}؟`)) return;
    this.adminService.deleteSurah(s._id).subscribe(() => {
      this.toast.success('تم حذف السورة.');
      this.load();
    });
  }
}
