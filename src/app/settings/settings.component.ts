import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-xl font-bold mb-4" transloco="settings.title">Settings</h2>
      <div class="mb-4">
        <label for="language-select" class="block text-gray-700 text-sm font-bold mb-2">{{'settings.selectLanguage' | transloco}}</label>
        <select id="language-select" (change)="changeLanguage($event)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="en" [selected]="currentLanguage() === 'en'">English</option>
          <option value="es" [selected]="currentLanguage() === 'es'">Español</option>
          <option value="gl" [selected]="currentLanguage() === 'gl'">Galego</option>
        </select>
      </div>
      <div class="mb-4">
        <label for="dark-mode-toggle" class="block text-gray-700 text-sm font-bold mb-2">{{'settings.darkMode' | transloco}}</label>
        <div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input type="checkbox" name="toggle" id="dark-mode-toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" [checked]="isDarkMode()" (change)="toggleDarkMode()"/>
          <label for="dark-mode-toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
        </div>
      </div>
    </div>
  `,
})
export default class SettingsComponent implements OnInit {
  private translocoService = inject(TranslocoService);
  currentLanguage = signal(this.translocoService.getActiveLang());
  isDarkMode = signal(false);

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage.set(lang);
    });
  }

  ngOnInit() {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      this.isDarkMode.set(storedDarkMode === 'true');
    } else {
      this.isDarkMode.set(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    this.updateDarkMode();
  }

  changeLanguage(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.translocoService.setActiveLang(selectedLanguage);
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
    localStorage.setItem('darkMode', String(this.isDarkMode()));
    this.updateDarkMode();
  }

  private updateDarkMode() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
