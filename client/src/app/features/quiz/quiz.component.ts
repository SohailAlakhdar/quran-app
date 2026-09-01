import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../core/services/quiz.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AnswerOptionComponent } from '../../shared/components/answer-option/answer-option.component';
import { PublicQuestion } from '../../core/models/question.model';

const LETTERS = ['A', 'B', 'C', 'D'];
const CORRECT_MESSAGES = ['أحسنت! 🌟', 'ممتاز! 👏', 'إجابة رائعة! ⭐'];
const INCORRECT_MESSAGES = ['اقتربت! 💪', 'حاول مرة أخرى في المرة القادمة! 🙂'];

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AnswerOptionComponent],
  template: `
    <app-navbar></app-navbar>

    @if (questions().length) {
      <div class="page-container" style="max-width: 700px;">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="fw-bold">سؤال {{ currentIndex() + 1 }} / {{ questions().length }}</span>
          <span class="badge-star rounded-pill px-3 py-2"><i class="bi bi-star-fill"></i> {{ starsThisQuiz() }}</span>
        </div>
        <div class="progress mb-4" style="height: 10px;">
          <div class="progress-bar" role="progressbar" style="background: var(--color-teal);"
               [style.width.%]="progressPercent()"></div>
        </div>

        @if (currentQuestion(); as q) {
          <div class="card card-app p-4 mb-4 animate-pop">
            <h5 class="fw-bold mb-4">{{ q.text }}</h5>
            <div class="d-flex flex-column gap-3">
              @for (opt of q.options; track $index) {
                <app-answer-option
                  [letter]="letters[$index]"
                  [text]="opt.text"
                  [disabled]="answered()"
                  [state]="optionState($index)"
                  (selected)="selectAnswer($index)">
                </app-answer-option>
              }
            </div>
          </div>
        }

        @if (feedback(); as f) {
          <div class="card card-app p-4 mb-4 animate-pop" [class.border-success]="f.correct" [class.border-danger]="!f.correct">
            <h5 class="fw-bold" [class.text-success]="f.correct" [class.text-danger]="!f.correct">
              {{ f.message }}
            </h5>
            @if (!f.correct) {
              <p class="mb-1"><strong>الإجابة الصحيحة:</strong> {{ letters[f.correctAnswer] }}. {{ currentQuestion()?.options?.[f.correctAnswer]?.text }}</p>
            }
            @if (f.explanation) {
              <p class="text-muted mb-3">{{ f.explanation }}</p>
            }
            <button class="btn btn-emerald align-self-start" (click)="next()">
              {{ isLastQuestion() ? 'عرض النتيجة' : 'التالي' }}
              <i class="bi bi-arrow-left ms-1"></i>
            </button>
          </div>
        }
      </div>
    } @else {
      <div class="page-container text-center">
        <p class="text-muted">لا يوجد اختبار نشط. الرجاء اختيار سورة والبدء من جديد.</p>
      </div>
    }
  `
})
export class QuizComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private quizService = inject(QuizService);

  letters = LETTERS;

  quizId = '';
  questions = signal<PublicQuestion[]>([]);
  currentIndex = signal(0);
  answered = signal(false);
  selectedIndex = signal<number | null>(null);
  starsThisQuiz = signal(0);

  feedback = signal<{ correct: boolean; correctAnswer: number; explanation: string; message: string } | null>(null);

  currentQuestion(): PublicQuestion | undefined {
    return this.questions()[this.currentIndex()];
  }

  progressPercent(): number {
    if (!this.questions().length) return 0;
    return Math.round((this.currentIndex() / this.questions().length) * 100);
  }

  isLastQuestion(): boolean {
    return this.currentIndex() === this.questions().length - 1;
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId') || '';
    const state = this.quizService.currentQuiz();
    if (state && state.quizId === this.quizId) {
      this.questions.set(state.questions);
    }
  }

  optionState($index: number): 'idle' | 'correct' | 'incorrect' {
    if (!this.answered()) return 'idle';
    const f = this.feedback();
    if (!f) return 'idle';
    if ($index === f.correctAnswer) return 'correct';
    if ($index === this.selectedIndex() && !f.correct) return 'incorrect';
    return 'idle';
  }

  selectAnswer(index: number): void {
    if (this.answered()) return;
    const question = this.currentQuestion();
    if (!question) return;

    this.selectedIndex.set(index);
    this.answered.set(true);

    this.quizService.submitAnswer(this.quizId, question.id, index).subscribe((res) => {
      const { correct, correctAnswer, explanation, starsEarned } = res.data;
      this.starsThisQuiz.update((s) => s + starsEarned);
      const pool = correct ? CORRECT_MESSAGES : INCORRECT_MESSAGES;
      const message = pool[Math.floor(Math.random() * pool.length)];
      this.feedback.set({ correct, correctAnswer, explanation, message });
    });
  }

  next(): void {
    if (this.isLastQuestion()) {
      this.router.navigate(['/results', this.quizId]);
      return;
    }
    this.currentIndex.update((i) => i + 1);
    this.answered.set(false);
    this.selectedIndex.set(null);
    this.feedback.set(null);
  }
}
