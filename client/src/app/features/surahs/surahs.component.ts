import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SurahService } from '../../core/services/surah.service';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { SurahCardComponent } from '../../shared/components/surah-card/surah-card.component';
import { Surah } from '../../core/models/surah.model';

@Component({
  selector: 'app-surahs',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SurahCardComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="page-container">
      <h3 class="fw-bold mb-3">اختر السورة</h3>

      <div class="row g-2 mb-4">
        <div class="col-md-8">
          <input type="text" class="form-control form-control-lg" placeholder="ابحث عن سورة..." [(ngModel)]="searchTerm">
        </div>
        <div class="col-md-4">
          <select class="form-select form-select-lg" [(ngModel)]="juzFilter">
            <option [ngValue]="null">كل الأجزاء</option>
            @for (j of juzOptions(); track j) {
              <option [ngValue]="j">جزء {{ j }}</option>
            }
          </select>
        </div>
      </div>

      <div class="row g-3">
        @for (s of filteredSurahs(); track s._id) {
          <div class="col-sm-6 col-md-4">
            <app-surah-card [surah]="s" (start)="onStart(s)"></app-surah-card>
          </div>
        }
      </div>

      @if (!filteredSurahs().length) {
        <p class="text-muted text-center mt-5">لا توجد نتائج مطابقة.</p>
      }
    </div>
  `
})
export class SurahsComponent implements OnInit {
  private surahService = inject(SurahService);
  private router = inject(Router);

  surahs = signal<Surah[]>([]);
  searchTerm = '';
  juzFilter: number | null = null;

  juzOptions = computed(() => Array.from(new Set(this.surahs().map((s) => s.juz))).sort((a, b) => a - b));

  // A plain method (not computed()) so it re-evaluates on every change
  // detection cycle, since searchTerm/juzFilter are ngModel-bound plain
  // fields rather than signals.
  filteredSurahs(): Surah[] {
    return this.surahs().filter((s) => {
      const matchesSearch =
        !this.searchTerm ||
        s.arabicName.includes(this.searchTerm) ||
        s.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesJuz = this.juzFilter === null || s.juz === this.juzFilter;
      return matchesSearch && matchesJuz;
    });
  }

  ngOnInit(): void {
    this.surahService.getSurahs().subscribe((res) => this.surahs.set(res.data.surahs));
  }

  onStart(surah: Surah): void {
    this.router.navigate(['/training', surah._id]);
  }
}
