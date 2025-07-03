import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component'),
  },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.component'),
  },
  {
    path: 'chrono',
    loadComponent: () => import('./chrono/chrono.component'),
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component'),
  },
];
