import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Surah } from '../../../core/models/surah.model';

@Component({
  selector: 'app-surah-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-app h-100 p-3">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <h5 class="fw-bold mb-0">{{ surah.arabicName }}</h5>
          <small class="text-muted">{{ surah.name }} · جزء {{ surah.juz }}</small>
        </div>
        <span class="badge rounded-pill" style="background: var(--color-emerald);">#{{ surah.number }}</span>
      </div>
      <div class="d-flex gap-3 text-muted small mb-3">
        <span><i class="bi bi-list-ol me-1"></i>{{ surah.ayahCount }} آية</span>
        <span><i class="bi bi-patch-question me-1"></i>{{ surah.quizQuestionCount }} أسئلة</span>
      </div>
      <button class="btn btn-emerald mt-auto" (click)="start.emit(surah)">
        <i class="bi bi-play-fill me-1"></i> ابدأ
      </button>
    </div>
  `
})
export class SurahCardComponent {
  @Input({ required: true }) surah!: Surah;
  @Output() start = new EventEmitter<Surah>();
}
