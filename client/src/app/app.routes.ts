import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then((m) => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/admin-login.component').then((m) => m.AdminLoginComponent)
  },

  // Child (protected) routes
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'surahs',
    canActivate: [authGuard],
    loadComponent: () => import('./features/surahs/surahs.component').then((m) => m.SurahsComponent)
  },
  {
    path: 'training/:surahId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/training/training.component').then((m) => m.TrainingComponent)
  },
  {
    path: 'quiz/:quizId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent)
  },
  {
    path: 'results/:quizId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/results/results.component').then((m) => m.ResultsComponent)
  },
  {
    path: 'review/:quizId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/review/review.component').then((m) => m.ReviewComponent)
  },
  {
    path: 'progress',
    canActivate: [authGuard],
    loadComponent: () => import('./features/progress/progress.component').then((m) => m.ProgressComponent)
  },
  {
    path: 'achievements',
    canActivate: [authGuard],
    loadComponent: () => import('./features/achievements/achievements.component').then((m) => m.AchievementsComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent)
  },

  // Admin (protected) routes
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
  },
  {
    path: 'admin/questions',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/questions/admin-questions.component').then((m) => m.AdminQuestionsComponent)
  },
  {
    path: 'admin/questions/add',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/questions/add-edit/question-form.component').then((m) => m.QuestionFormComponent)
  },
  {
    path: 'admin/questions/:id/edit',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/questions/add-edit/question-form.component').then((m) => m.QuestionFormComponent)
  },
  {
    path: 'admin/surahs',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/surahs/admin-surahs.component').then((m) => m.AdminSurahsComponent)
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/users/admin-users.component').then((m) => m.AdminUsersComponent)
  },
  {
    path: 'admin/statistics',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/statistics/admin-statistics.component').then((m) => m.AdminStatisticsComponent)
  },

  { path: '**', redirectTo: '' }
];
