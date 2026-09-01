import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Achievement } from '../../../core/models/achievement.model';

@Component({
  selector: 'app-achievement-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card card-app text-center p-3 h-100" [class.locked-achievement]="!achievement.unlocked">
      <div class="fs-1 mb-2">{{ achievement.icon }}</div>
      <h6 class="fw-bold mb-1">{{ achievement.name }}</h6>
      <p class="small text-muted mb-2">{{ achievement.description }}</p>
      @if (achievement.unlocked) {
        <span class="badge bg-success align-self-center">
          <i class="bi bi-check-circle-fill me-1"></i> تم الفتح
        </span>
      } @else {
        <span class="badge bg-secondary align-self-center">
          <i class="bi bi-lock-fill me-1"></i> مقفل
        </span>
      }
    </div>
  `
})
export class AchievementCardComponent {
  @Input({ required: true }) achievement!: Achievement;
}
