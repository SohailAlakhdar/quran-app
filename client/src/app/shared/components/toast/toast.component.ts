import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 3000;">
      @for (t of toastService.toasts(); track t.id) {
        <div class="toast show mb-2 animate-pop" [ngClass]="cssClass(t.kind)">
          <div class="d-flex align-items-center text-white p-2 px-3 rounded-3">
            <i class="bi me-2" [ngClass]="icon(t.kind)"></i>
            <span class="flex-grow-1">{{ t.text }}</span>
            <button type="button" class="btn-close btn-close-white ms-2" (click)="toastService.dismiss(t.id)"></button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  cssClass(kind: string): string {
    const map: Record<string, string> = {
      success: 'bg-success',
      error: 'bg-danger',
      warning: 'bg-warning',
      info: 'bg-info'
    };
    return map[kind] || 'bg-secondary';
  }

  icon(kind: string): string {
    const map: Record<string, string> = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return map[kind] || 'bi-bell-fill';
  }
}
