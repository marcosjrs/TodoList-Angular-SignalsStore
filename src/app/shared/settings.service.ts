import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  isDarkMode = signal(false);
  minimizeTasks = signal(false);

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      this.isDarkMode.set(storedDarkMode === 'true');
    } else {
      this.isDarkMode.set(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    this.updateDarkModeClass();

    const storedMinimizeTasks = localStorage.getItem('minimizeTasks');
    if (storedMinimizeTasks) {
      this.minimizeTasks.set(storedMinimizeTasks === 'true');
    } else {
      this.minimizeTasks.set(false);
    }
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('darkMode', String(this.isDarkMode()));
    this.updateDarkModeClass();
  }

  toggleMinimizeTasks() {
    this.minimizeTasks.set(!this.minimizeTasks());
    localStorage.setItem('minimizeTasks', String(this.minimizeTasks()));
  }

  private updateDarkModeClass() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setDarkMode(value: boolean) {
    this.isDarkMode.set(value);
    localStorage.setItem('darkMode', String(value));
    this.updateDarkModeClass();
  }

  setMinimizeTasks(value: boolean) {
    this.minimizeTasks.set(value);
    localStorage.setItem('minimizeTasks', String(value));
  }
}
