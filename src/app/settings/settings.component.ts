import { Component, signal, inject } from '@angular/core';
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
    </div>
  `,
})
export default class SettingsComponent {
  private translocoService = inject(TranslocoService);
  currentLanguage = signal(this.translocoService.getActiveLang());

  constructor() {
    this.translocoService.langChanges$.subscribe((lang) => {
      this.currentLanguage.set(lang);
    });
  }

  changeLanguage(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement).value;
    this.translocoService.setActiveLang(selectedLanguage);
  }
}
