import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent, ToastComponent],
  template: `
    <app-loading></app-loading>
    <app-toast></app-toast>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}
