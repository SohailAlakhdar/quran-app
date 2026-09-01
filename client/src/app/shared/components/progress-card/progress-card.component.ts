import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-app p-3 text-center h-100">
      <div class="fs-2 mb-1">{{ icon }}</div>
      <div class="fs-4 fw-bold">{{ value }}</div>
      <div class="text-muted small">{{ label }}</div>
    </div>
  `
})
export class ProgressCardComponent {
  @Input() icon = '⭐';
  @Input() value: string | number = 0;
  @Input() label = '';
}
