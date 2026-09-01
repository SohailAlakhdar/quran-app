import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 p-3" style="background: linear-gradient(135deg, var(--color-emerald), var(--color-teal));">
      <div class="card card-app p-4 p-md-5 animate-pop" style="max-width: 420px; width: 100%;">
        <div class="text-center mb-4">
          <div class="fs-1">🌙📖</div>
          <h3 class="fw-bold">تسجيل الدخول</h3>
          <p class="text-muted">أهلاً بعودتك!</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label fw-semibold">الاسم الأول</label>
            <input type="text" class="form-control form-control-lg" formControlName="firstName" placeholder="اكتب اسمك">
          </div>

          <div class="mb-4">
            <label class="form-label fw-semibold">كلمة المرور</label>
            <input type="password" class="form-control form-control-lg" formControlName="password" placeholder="كلمة المرور">
          </div>

          <button type="submit" class="btn btn-emerald btn-lg w-100" [disabled]="form.invalid || submitting">
            <i class="bi bi-box-arrow-in-left me-1"></i> دخول
          </button>
        </form>

        <p class="text-center mt-4 mb-0">
          ليس لديك حساب؟ <a routerLink="/signup">إنشاء حساب جديد</a>
        </p>
        <p class="text-center mt-2 mb-0">
          <a routerLink="/admin/login" class="text-muted small">دخول المشرف</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  submitting = false;

  form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const { firstName, password } = this.form.getRawValue();
    this.auth.login(firstName, password).subscribe({
      next: (res) => {
        this.toast.success('تم تسجيل الدخول بنجاح.');
        if (res.data.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      complete: () => (this.submitting = false),
      error: () => (this.submitting = false)
    });
  }
}
