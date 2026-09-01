import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AdminSidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { User } from '../../../core/models/user.model';
import { Paginated } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminSidebarComponent],
  template: `
    <div class="d-flex">
      <div style="width: 260px; flex-shrink: 0;">
        <app-admin-sidebar></app-admin-sidebar>
      </div>
      <div class="flex-grow-1 p-4" style="background: var(--color-cream); min-height: 100vh;">
        <h3 class="fw-bold mb-4">إدارة الأطفال</h3>

        <div class="mb-3" style="max-width: 340px;">
          <input type="text" class="form-control" placeholder="ابحث بالاسم..." [(ngModel)]="search" (ngModelChange)="reload()">
        </div>

        <div class="card card-app p-0">
          <table class="table table-hover mb-0 align-middle">
            <thead class="table-light">
              <tr>
                <th>الاسم</th>
                <th>تاريخ التسجيل</th>
                <th>الاختبارات</th>
                <th>متوسط النتائج</th>
                <th>النجوم</th>
                <th>آخر نشاط</th>
              </tr>
            </thead>
            <tbody>
              @for (u of users(); track u._id) {
                <tr>
                  <td>{{ u.firstName }}</td>
                  <td>{{ u.createdAt | date: 'shortDate' }}</td>
                  <td>{{ u.totalQuizzes }}</td>
                  <td>{{ u.averageScore }}%</td>
                  <td><i class="bi bi-star-fill text-warning"></i> {{ u.stars }}</td>
                  <td>{{ u.lastActivity | date: 'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (pagination(); as p) {
          <nav class="mt-3">
            <ul class="pagination justify-content-center">
              @for (pg of pageNumbers(); track pg) {
                <li class="page-item" [class.active]="pg === p.page">
                  <button class="page-link" (click)="goToPage(pg)">{{ pg }}</button>
                </li>
              }
            </ul>
          </nav>
        }
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  pagination = signal<Paginated<User>['pagination'] | null>(null);
  search = '';
  page = 1;

  ngOnInit(): void {
    this.fetch();
  }

  reload(): void {
    this.page = 1;
    this.fetch();
  }

  fetch(): void {
    this.userService.getUsers(this.page, 10, this.search).subscribe((res) => {
      this.users.set(res.data.data);
      this.pagination.set(res.data.pagination);
    });
  }

  pageNumbers(): number[] {
    const total = this.pagination()?.totalPages || 1;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  goToPage(pg: number): void {
    this.page = pg;
    this.fetch();
  }
}
