import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SurahService } from '../../core/services/surah.service';
import { QuizService } from '../../core/services/quiz.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { Surah } from '../../core/models/surah.model';
import { QuestionType } from '../../core/models/question.model';

@Component({
  selector: 'app-training',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      @if (surah(); as s) {
        <div class="gradient-hero p-4 mb-4 text-center">
          <h3 class="fw-bold mb-1">{{ s.arabicName }}</h3>
          <p class="mb-0">اختر نوع التدريب</p>
        </div>
      }

      <div class="row g-4 justify-content-center">
        <div class="col-md-5">
          <div class="card card-app p-4 text-center h-100">
            <div class="fs-1 mb-2">📖</div>
            <h5 class="fw-bold mb-2">تدريب الحفظ</h5>
            <p class="text-muted small mb-3">اختبر حفظك لآيات السورة</p>
            <button class="btn btn-emerald btn-lg" [disabled]="starting" (click)="start('memorization')">ابدأ</button>
          </div>
        </div>
        <div class="col-md-5">
          <div class="card card-app p-4 text-center h-100">
            <div class="fs-1 mb-2">💡</div>
            <h5 class="fw-bold mb-2">تدريب التدبر والمعاني</h5>
            <p class="text-muted small mb-3">افهم معاني ورسائل السورة</p>
            <button class="btn btn-gold btn-lg" [disabled]="starting" (click)="start('tadabbur')">ابدأ</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrainingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private surahService = inject(SurahService);
  private quizService = inject(QuizService);

  surah = signal<Surah | null>(null);
  starting = false;
  private surahId = '';

  ngOnInit(): void {
    this.surahId = this.route.snapshot.paramMap.get('surahId') || '';
    this.surahService.getSurahById(this.surahId).subscribe((res) => this.surah.set(res.data.surah));
  }

  start(type: QuestionType): void {
    this.starting = true;
    this.quizService.startQuiz(this.surahId, type).subscribe({
      next: (res) => this.router.navigate(['/quiz', res.data.quizId]),
      complete: () => (this.starting = false),
      error: () => (this.starting = false)
    });
  }
}
