import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { QuizResult } from '../../core/models/quiz.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container text-center" style="max-width: 600px;">
      @if (result(); as r) {
        <div class="card card-app p-4 p-md-5 animate-pop">
          <div class="fs-1 mb-2">🎉</div>
          <h2 class="fw-bold mb-1">أحسنت!</h2>
          <p class="text-muted mb-4">{{ r.surah.arabicName }} · {{ r.type === 'memorization' ? 'الحفظ' : 'التدبر والمعاني' }}</p>

          <div class="d-flex justify-content-center mb-4">
            <div class="rounded-circle d-flex align-items-center justify-content-center"
                 style="width: 150px; height: 150px; border: 10px solid var(--color-gold-light); background: var(--color-cream);">
              <div>
                <div class="fs-3 fw-bold">{{ r.percentage }}%</div>
                <div class="small text-muted">{{ r.correctAnswers }} / {{ r.totalQuestions }}</div>
              </div>
            </div>
          </div>

          <div class="row g-3 mb-4">
            <div class="col-4">
              <div class="fw-bold fs-4 text-success">{{ r.correctAnswers }}</div>
              <div class="small text-muted">صحيحة</div>
            </div>
            <div class="col-4">
              <div class="fw-bold fs-4 text-danger">{{ r.wrongAnswers }}</div>
              <div class="small text-muted">خاطئة</div>
            </div>
            <div class="col-4">
              <div class="fw-bold fs-4" style="color: var(--color-gold);">
                <i class="bi bi-star-fill"></i> {{ r.starsEarned }}
              </div>
              <div class="small text-muted">نجوم</div>
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-center flex-wrap">
            <a [routerLink]="['/training', surahId]" class="btn btn-emerald">إعادة التدريب</a>
            <a [routerLink]="['/review', r.quizId]" class="btn btn-outline-secondary">مراجعة الإجابات</a>
            <a routerLink="/surahs" class="btn btn-outline-secondary">سورة أخرى</a>
            <a routerLink="/dashboard" class="btn btn-outline-secondary">العودة للرئيسية</a>
          </div>
        </div>
      }
    </div>
  `
})
export class ResultsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);

  result = signal<QuizResult | null>(null);
  surahId = '';

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('quizId') || '';
    this.quizService.getResult(quizId).subscribe((res) => {
      this.result.set(res.data);
      this.surahId = res.data.surah?._id || '';
    });
  }
}
