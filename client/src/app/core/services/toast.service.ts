import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: number;
  kind: ToastKind;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<ToastMessage[]>([]);

  show(text: string, kind: ToastKind = 'info', duration = 3500): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, kind, text }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  success(text: string): void { this.show(text, 'success'); }
  error(text: string): void { this.show(text, 'error'); }
  warning(text: string): void { this.show(text, 'warning'); }
  info(text: string): void { this.show(text, 'info'); }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
