import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg" style="background: var(--color-emerald);">
      <div class="container-fluid page-container">
        <a class="navbar-brand text-white fw-bold" routerLink="/dashboard">
          <i class="bi bi-moon-stars-fill me-2"></i> رحلة القرآن
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navMenu">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2">
            <li class="nav-item"><a class="nav-link text-white" routerLink="/dashboard" routerLinkActive="fw-bold text-decoration-underline">الرئيسية</a></li>
            <li class="nav-item"><a class="nav-link text-white" routerLink="/surahs" routerLinkActive="fw-bold text-decoration-underline">السور</a></li>
            <li class="nav-item"><a class="nav-link text-white" routerLink="/progress" routerLinkActive="fw-bold text-decoration-underline">تقدمي</a></li>
            <li class="nav-item"><a class="nav-link text-white" routerLink="/achievements" routerLinkActive="fw-bold text-decoration-underline">الإنجازات</a></li>
            <li class="nav-item"><a class="nav-link text-white" routerLink="/profile" routerLinkActive="fw-bold text-decoration-underline">حسابي</a></li>
          </ul>
          @if (auth.currentUser(); as user) {
            <div class="d-flex align-items-center gap-3 ms-lg-3 mt-2 mt-lg-0">
              <span class="badge-star rounded-pill px-3 py-2">
                <i class="bi bi-star-fill"></i> {{ user.stars }}
              </span>
              <span class="text-white">مرحباً {{ user.firstName }} 👋</span>
              <button class="btn btn-sm btn-light" (click)="onLogout()">خروج</button>
            </div>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
