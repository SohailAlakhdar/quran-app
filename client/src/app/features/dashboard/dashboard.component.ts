import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProgressService } from '../../core/services/progress.service';
import { SurahService } from '../../core/services/surah.service';
import { AchievementService } from '../../core/services/achievement.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { ProgressCardComponent } from '../../shared/components/progress-card/progress-card.component';
import { Progress } from '../../core/models/progress.model';
import { Surah } from '../../core/models/surah.model';
import { Achievement } from '../../core/models/achievement.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ProgressCardComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="page-container">
      @if (auth.currentUser(); as user) {
        <div class="gradient-hero p-4 mb-4">
          <h2 class="fw-bold mb-1">مرحباً يا {{ user.firstName }} 👋</h2>
          <p class="mb-0">جاهز لتدريب اليوم؟</p>
        </div>
      }

      @if (progress(); as p) {
        <div class="row g-3 mb-4">
          <div class="col-6 col-md-3">
            <app-progress-card icon="⭐" [value]="p.totalStars" label="النجوم"></app-progress-card>
          </div>
          <div class="col-6 col-md-3">
            <app-progress-card icon="📚" [value]="p.totalQuizzes" label="الاختبارات"></app-progress-card>
          </div>
          <div class="col-6 col-md-3">
            <app-progress-card icon="🎯" [value]="p.averageScore + '%'" label="متوسط النتائج"></app-progress-card>
          </div>
          <div class="col-6 col-md-3">
            <app-progress-card icon="🏆" [value]="unlockedCount()" label="الإنجازات"></app-progress-card>
          </div>
        </div>
      }

      <h4 class="fw-bold mb-3">اختر تدريبك</h4>
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <a routerLink="/surahs" class="text-decoration-none">
            <div class="card card-app p-4 h-100 d-flex flex-row align-items-center gap-3">
              <div class="fs-1">📖</div>
              <div>
                <h5 class="fw-bold mb-1 text-dark">الحفظ</h5>
                <p class="text-muted small mb-0">تدرب على حفظ آيات السور</p>
              </div>
            </div>
          </a>
        </div>
        <div class="col-md-6">
          <a routerLink="/surahs" class="text-decoration-none">
            <div class="card card-app p-4 h-100 d-flex flex-row align-items-center gap-3">
              <div class="fs-1">💡</div>
              <div>
                <h5 class="fw-bold mb-1 text-dark">التدبر والمعاني</h5>
                <p class="text-muted small mb-0">افهم معاني الآيات ورسائلها</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div class="row">
        <div class="col-md-7">
          <h5 class="fw-bold mb-3">أحدث السور</h5>
          <div class="row g-3">
            @for (s of recentSurahs(); track s._id) {
              <div class="col-6">
                <div class="card card-app p-3">
                  <div class="fw-bold">{{ s.arabicName }}</div>
                  <small class="text-muted">{{ s.ayahCount }} آية</small>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="col-md-5">
          <h5 class="fw-bold mb-3">إنجازاتي الأخيرة</h5>
          <div class="d-flex flex-wrap gap-2">
            @for (a of recentAchievements(); track a.id) {
              <span class="badge bg-light text-dark border p-2 fs-6">{{ a.icon }} {{ a.name }}</span>
            }
            @if (!recentAchievements().length) {
              <p class="text-muted small">لا توجد إنجازات مفتوحة بعد. ابدأ تدريباً لتكسب أول إنجاز!</p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private progressService = inject(ProgressService);
  private surahService = inject(SurahService);
  private achievementService = inject(AchievementService);

  progress = signal<Progress | null>(null);
  recentSurahs = signal<Surah[]>([]);
  achievements = signal<Achievement[]>([]);
  unlockedCount = signal(0);
  recentAchievements = signal<Achievement[]>([]);

  ngOnInit(): void {
    this.progressService.getProgress().subscribe((res) => this.progress.set(res.data));
    this.surahService.getSurahs().subscribe((res) => this.recentSurahs.set(res.data.surahs.slice(0, 4)));
    this.achievementService.getAchievements().subscribe((res) => {
      const unlocked = res.data.achievements.filter((a) => a.unlocked);
      this.unlockedCount.set(unlocked.length);
      this.recentAchievements.set(unlocked.slice(0, 4));
    });
  }
}
