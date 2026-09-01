import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.currentUser()?.role === 'child') {
    return true;
  }

  if (auth.isLoggedIn() && auth.currentUser()?.role === 'admin') {
    // An admin session shouldn't be used to browse the child app.
    router.navigate(['/admin']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};
