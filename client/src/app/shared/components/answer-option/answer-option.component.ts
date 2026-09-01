import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-answer-option',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="option-btn d-flex align-items-center gap-2"
      [class.correct]="state === 'correct'"
      [class.incorrect]="state === 'incorrect'"
      [class.animate-shake]="state === 'incorrect'"
      [disabled]="disabled"
      (click)="selected.emit()">
      <span class="fw-bold">{{ letter }}.</span>
      <span>{{ text }}</span>
    </button>
  `
})
export class AnswerOptionComponent {
  @Input() letter = 'A';
  @Input() text = '';
  @Input() disabled = false;
  @Input() state: 'idle' | 'correct' | 'incorrect' = 'idle';
  @Output() selected = new EventEmitter<void>();
}
