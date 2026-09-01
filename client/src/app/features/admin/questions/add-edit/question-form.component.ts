import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { SurahService } from '../../../../core/services/surah.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AdminSidebarComponent } from '../../../../layout/sidebar/sidebar.component';
import { Surah } from '../../../../core/models/surah.model';
import { AdminQuestion, Difficulty, QuestionType } from '../../../../core/models/question.model';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <h3 class="fw-bold mb-4">{{ questionId ? 'تعديل السؤال' : 'إضافة سؤال جديد' }}</h3>

        <form [formGroup]="form" (ngSubmit)="save()" class="card card-app p-4" style="max-width: 800px;">
          <div class="row g-3 mb-2">
            <div class="col-md-6">
              <label class="form-label fw-semibold">السورة</label>
              <select class="form-select" formControlName="surah">
                <option value="" disabled>اختر السورة</option>
                @for (s of surahs(); track s._id) {
                  <option [value]="s._id">{{ s.arabicName }}</option>
                }
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-semibold">نوع التدريب</label>
              <select class="form-select" formControlName="type">
                <option value="memorization">حفظ</option>
                <option value="tadabbur">تدبر</option>
              </select>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-semibold">نص السؤال</label>
            <textarea class="form-control" rows="2" formControlName="text"></textarea>
          </div>

          <div class="mb-2">
            <label class="form-label fw-semibold">الخيارات الأربعة</label>
            <div formArrayName="options">
              @for (opt of options.controls; track $index; let i = $index) {
                <div class="input-group mb-2" [formGroupName]="i">
                  <span class="input-group-text">{{ letters[i] }}</span>
                  <input type="text" class="form-control" formControlName="text" [placeholder]="'خيار ' + letters[i]">
                  <div class="input-group-text">
                    <input type="radio" name="correctAnswer" [value]="i"
                           [checked]="form.value.correctAnswer === i"
                           (change)="form.patchValue({ correctAnswer: i })">
                    <span class="ms-1 small">صحيح</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="row g-3 mb-3">
            <div class="col-md-6">
              <label class="form-label fw-semibold">مستوى الصعوبة</label>
              <select class="form-select" formControlName="difficulty">
                <option value="easy">سهل</option>
                <option value="medium">متوسط</option>
                <option value="hard">صعب</option>
              </select>
            </div>
            <div class="col-md-6 d-flex align-items-end">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" formControlName="isActive" id="isActive">
                <label class="form-check-label" for="isActive">فعال</label>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">الشرح</label>
            <textarea class="form-control" rows="2" formControlName="explanation"></textarea>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-emerald" [disabled]="form.invalid">حفظ</button>
            <button type="button" class="btn btn-outline-secondary" (click)="router.navigate(['/admin/questions'])">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class QuestionFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private surahService = inject(SurahService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  letters = ['A', 'B', 'C', 'D'];
  surahs = signal<Surah[]>([]);
  questionId = '';

  form = this.fb.nonNullable.group({
    surah: ['', Validators.required],
    type: ['memorization', Validators.required],
    text: ['', Validators.required],
    options: this.fb.array([
      this.fb.group({ text: ['', Validators.required] }),
      this.fb.group({ text: ['', Validators.required] }),
      this.fb.group({ text: ['', Validators.required] }),
      this.fb.group({ text: ['', Validators.required] })
    ]),
    correctAnswer: [0, Validators.required],
    difficulty: ['medium', Validators.required],
    isActive: [true],
    explanation: ['']
  });

  get options() {
    return this.form.get('options') as import('@angular/forms').FormArray;
  }

  ngOnInit(): void {
    this.surahService.getSurahs().subscribe((res) => this.surahs.set(res.data.surahs));

    this.questionId = this.route.snapshot.paramMap.get('id') || '';
    if (this.questionId) {
      this.adminService.getQuestionById(this.questionId).subscribe((res) => {
        const q = res.data.question;
        this.form.patchValue({
          surah: typeof q.surah === 'string' ? q.surah : q.surah._id,
          type: q.type,
          text: q.text,
          correctAnswer: q.correctAnswer,
          difficulty: q.difficulty,
          isActive: q.isActive,
          explanation: q.explanation
        });
        q.options.forEach((opt, i) => this.options.at(i).patchValue(opt));
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Partial<AdminQuestion> = {
      surah: raw.surah,
      type: raw.type as QuestionType,
      text: raw.text,
      options: raw.options.map((o) => ({ text: o.text || '' })),
      correctAnswer: raw.correctAnswer,
      difficulty: raw.difficulty as Difficulty,
      isActive: raw.isActive,
      explanation: raw.explanation
    };
    const req = this.questionId
      ? this.adminService.updateQuestion(this.questionId, payload)
      : this.adminService.createQuestion(payload);

    req.subscribe(() => {
      this.toast.success(this.questionId ? 'تم تحديث السؤال بنجاح.' : 'تم إضافة السؤال بنجاح.');
      this.router.navigate(['/admin/questions']);
    });
  }
}
