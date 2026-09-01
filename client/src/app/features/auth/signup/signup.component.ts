import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 p-3" style="background: linear-gradient(135deg, var(--color-emerald), var(--color-teal));">
      <div class="card card-app p-4 p-md-5 animate-pop" style="max-width: 420px; width: 100%;">
        <div class="text-center mb-4">
          <div class="fs-1">📖✨</div>
          <h3 class="fw-bold">إنشاء حساب جديد</h3>
          <p class="text-muted">ابدأ رحلتك مع القرآن الكريم</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label fw-semibold">الاسم الأول</label>
            <input type="text" class="form-control form-control-lg" formControlName="firstName" placeholder="اكتب اسمك">
            @if (form.controls.firstName.touched && form.controls.firstName.invalid) {
              <div class="text-danger small mt-1">الاسم يجب أن يكون بين 2 و 50 حرفاً.</div>
            }
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">كلمة المرور</label>
            <input type="password" class="form-control form-control-lg" formControlName="password" placeholder="كلمة المرور">
            @if (form.controls.password.touched && form.controls.password.invalid) {
              <div class="text-danger small mt-1">كلمة المرور يجب أن تكون 4 أحرف على الأقل.</div>
            }
          </div>

          <button type="submit" class="btn btn-emerald btn-lg w-100" [disabled]="form.invalid || submitting">
            <i class="bi bi-person-plus-fill me-1"></i> إنشاء الحساب
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          لديك حساب بالفعل؟ <a routerLink="/login">تسجيل الدخول</a>
        </p>
      </div>
    </div>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  submitting = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { firstName, password } = this.form.getRawValue();
    this.auth.signup(firstName, password).subscribe({
      next: () => {
        this.toast.success('تم إنشاء الحساب بنجاح.');
        this.router.navigate(['/dashboard']);
      },
      complete: () => (this.submitting = false),
      error: () => (this.submitting = false)
    });
  }
}
