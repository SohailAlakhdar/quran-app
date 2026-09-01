import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex flex-column" style="background: var(--color-cream);">
      <div class="gradient-hero text-center py-5 px-3">
        <div class="fs-1 mb-2">📖🌙⭐</div>
        <h1 class="fw-bold display-5">رحلة القرآن</h1>
        <p class="lead">تعلم، تدبر، واستمتع بحفظ كتاب الله</p>
        <div class="d-flex gap-2 justify-content-center mt-4">
          <a routerLink="/signup" class="btn btn-gold btn-lg">ابدأ الآن</a>
          <a routerLink="/login" class="btn btn-outline-light btn-lg">تسجيل الدخول</a>
        </div>
      </div>

      <div class="page-container">
        <div class="row g-4 mt-2">
          <div class="col-md-4">
            <div class="card card-app p-4 text-center h-100">
              <div class="fs-1 mb-2">📖</div>
              <h5 class="fw-bold">حفظ القرآن</h5>
              <p class="text-muted small">تدرب على حفظ السور بأسلوب ممتع وتفاعلي.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-app p-4 text-center h-100">
              <div class="fs-1 mb-2">💡</div>
              <h5 class="fw-bold">التدبر والمعاني</h5>
              <p class="text-muted small">افهم معاني الآيات وتدبر رسائلها.</p>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card card-app p-4 text-center h-100">
              <div class="fs-1 mb-2">🏆</div>
              <h5 class="fw-bold">إنجازات ونجوم</h5>
              <p class="text-muted small">اجمع النجوم وافتح الإنجازات مع كل تقدم.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
