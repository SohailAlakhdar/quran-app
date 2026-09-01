import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 p-3" style="background: var(--color-emerald-dark);">
      <div class="card card-app p-4 p-md-5 animate-pop" style="max-width: 420px; width: 100%;">
        <div class="text-center mb-4">
          <div class="fs-1"><i class="bi bi-shield-lock-fill text-emerald" style="color: var(--color-emerald);"></i></div>
          <h3 class="fw-bold">دخول المشرف</h3>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label class="form-label fw-semibold">اسم المستخدم</label>
            <input type="text" class="form-control form-control-lg" formControlName="firstName">
          </div>
          <div class="mb-4">
            <label class="form-label fw-semibold">كلمة المرور</label>
            <input type="password" class="form-control form-control-lg" formControlName="password">
          </div>
          <button type="submit" class="btn btn-emerald btn-lg w-100" [disabled]="form.invalid || submitting">
            دخول
          </button>
        </form>
        <p class="text-center mt-3 mb-0"><a routerLink="/login" class="text-muted small">العودة لتسجيل دخول الطالب</a></p>
      </div>
    </div>
  `
})
export class AdminLoginComponent {
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
    if (this.form.invalid) return;
    this.submitting = true;
    const { firstName, password } = this.form.getRawValue();
    this.auth.login(firstName, password).subscribe({
      next: (res) => {
        if (res.data.user.role !== 'admin') {
          this.toast.error('هذا الحساب لا يملك صلاحية الإدارة.');
          this.auth.logout();
          return;
        }
        this.toast.success('تم تسجيل الدخول بنجاح.');
        this.router.navigate(['/admin']);
      },
      complete: () => (this.submitting = false),
      error: () => (this.submitting = false)
    });
  }
}
