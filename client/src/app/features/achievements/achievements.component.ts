import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService } from '../../core/services/achievement.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { AchievementCardComponent } from '../../shared/components/achievement-card/achievement-card.component';
import { Achievement } from '../../core/models/achievement.model';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule, NavbarComponent, AchievementCardComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h3 class="fw-bold mb-4">الإنجازات</h3>
      <div class="row g-3">
        @for (a of achievements(); track a.id) {
          <div class="col-6 col-md-4 col-lg-3">
            <app-achievement-card [achievement]="a"></app-achievement-card>
          </div>
        }
      </div>
    </div>
  `
})
export class AchievementsComponent implements OnInit {
  private achievementService = inject(AchievementService);
  achievements = signal<Achievement[]>([]);

  ngOnInit(): void {
    this.achievementService.getAchievements().subscribe((res) => this.achievements.set(res.data.achievements));
  }
}
