import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, finalize } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const loading = inject(LoadingService);
  const auth = inject(AuthService);
  const router = inject(Router);

  loading.start();

  return next(req).pipe(
    catchError((err) => {
      const message = err?.error?.message || 'حدث خطأ، حاول مرة أخرى.';

      if (err.status === 401) {
        auth.logout();
        toast.error('انتهت الجلسة، الرجاء تسجيل الدخول مرة أخرى.');
        router.navigate(['/login']);
      } else {
        toast.error(message);
      }

      return throwError(() => err);
    }),
    finalize(() => loading.stop())
  );
};
