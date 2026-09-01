import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { QuizReviewItem } from '../../core/models/quiz.model';

const LETTERS = ['A', 'B', 'C', 'D'];

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container" style="max-width: 700px;">
      <h3 class="fw-bold mb-4">مراجعة الإجابات</h3>

      @for (item of review(); track $index) {
        <div class="card card-app p-4 mb-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="fw-bold mb-0">{{ $index + 1 }}. {{ item.question }}</h6>
            @if (item.isCorrect) {
              <span class="badge bg-success">✓ صحيح</span>
            } @else {
              <span class="badge bg-danger">✕ غير صحيح</span>
            }
          </div>
          <div class="mb-2">
            @for (opt of item.options; track opt.text; let i = $index) {
              <div class="small mb-1"
                   [class.text-success]="i === item.correctAnswer"
                   [class.fw-bold]="i === item.correctAnswer || i === item.selectedAnswer"
                   [class.text-danger]="i === item.selectedAnswer && !item.isCorrect">
                {{ letters[i] }}. {{ opt.text }}
                @if (i === item.correctAnswer) { <i class="bi bi-check-circle-fill ms-1"></i> }
                @if (i === item.selectedAnswer && !item.isCorrect) { <i class="bi bi-x-circle-fill ms-1"></i> }
              </div>
            }
          </div>
          @if (item.explanation) {
            <p class="text-muted small mb-0"><i class="bi bi-lightbulb me-1"></i>{{ item.explanation }}</p>
          }
        </div>
      }

      <div class="text-center mt-4">
        <a routerLink="/dashboard" class="btn btn-emerald">العودة للرئيسية</a>
      </div>
    </div>
  `
})
export class ReviewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private quizService = inject(QuizService);

  letters = LETTERS;
  review = signal<QuizReviewItem[]>([]);

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('quizId') || '';
    this.quizService.getReview(quizId).subscribe((res) => this.review.set(res.data.review));
  }
}
