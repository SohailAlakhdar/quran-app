import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = signal(0);
  readonly isLoading = signal(false);

  start(): void {
    this.counter.update((c) => c + 1);
    this.isLoading.set(true);
  }

  stop(): void {
    this.counter.update((c) => Math.max(c - 1, 0));
    this.isLoading.set(this.counter() > 0);
  }
}
