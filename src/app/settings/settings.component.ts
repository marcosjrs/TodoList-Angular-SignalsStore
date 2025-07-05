import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { CategoriesService } from './categories.service';
import { TasksStore } from '../tasks/tasks.store';
import { SettingsService } from '../shared/settings.service';
import {
  faTrash,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    FontAwesomeModule,
    ConfirmationPopupComponent,
  ],
  styleUrl: './settings.component.scss',
  template: `
    <div class="container mx-auto p-4">
      <div class="container-mode-toggle">
        <div class="relative inline-block">
          <div>
            <label for="dark-mode-toggle"
              >{{ 'settings.darkMode' | transloco }}
            </label>
            <input
              type="checkbox"
              name="toggle"
              id="dark-mode-toggle"
              class="toggle-checkbox"
              [checked]="isDarkMode()"
              (change)="toggleDarkMode()"
            />
          </div>
        </div>
      </div>
      <h3 class="text-lg font-bold mb-2">
        {{ 'settings.selectLanguage' | transloco }}
      </h3>
      <div class="mb-4">
        <select
          id="language-select"
          (change)="changeLanguage($event)"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="en" [selected]="currentLanguage() === 'en'">
            English
          </option>
          <option value="es" [selected]="currentLanguage() === 'es'">
            Español
          </option>
          <option value="gl" [selected]="currentLanguage() === 'gl'">
            Galego
          </option>
        </select>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">
          {{ 'settings.categories' | transloco }}
        </h3>
        <div class="flex mb-2">
          <input
            type="text"
            #newCategory
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
          />
          <button
            (click)="addCategory(newCategory.value); newCategory.value = ''"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ 'settings.addCategory' | transloco }}
          </button>
        </div>
        <ul>
          @for (category of categoriesService.categories(); track category) {
          <li class="flex justify-between items-center mb-1">
            <span>{{ category }}</span>
            <button
              (click)="removeCategory(category)"
              class="text-red-500 hover:text-red-700"
            >
              <fa-icon [icon]="faTrash"></fa-icon>
            </button>
          </li>
          }
        </ul>
      </div>
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">
          {{ 'settings.dataManagement' | transloco }}
        </h3>
        <div>
          <button
            (click)="exportData()"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            <fa-icon [icon]="faDownload"></fa-icon>
            {{ 'settings.exportData' | transloco }}
          </button>

          <input
            type="file"
            (change)="importData($event)"
            accept=".json"
            class="hidden"
            #fileInput
          />

          <button
            (click)="fileInput.click()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <fa-icon [icon]="faUpload"></fa-icon>
            {{ 'settings.importData' | transloco }}
          </button>
        </div>
        <div>
          <button
            (click)="confirmClearCompletedTasks()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            <fa-icon [icon]="faTrash"></fa-icon>
            {{ 'settings.clearCompleted' | transloco }}
          </button>
        </div>
        <div>
          <button
            (click)="confirmClearPastDatedTasks()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            <fa-icon [icon]="faTrash"></fa-icon>
            {{ 'settings.clearPastDated' | transloco }}
          </button>
        </div>
        <div>
          <button
            (click)="confirmClearAllData()"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
          >
            <fa-icon [icon]="faTrash"></fa-icon>
            {{ 'settings.clearAllData' | transloco }}
          </button>
        </div>
      </div>
      <div class="relative inline-block mt-4">
        <div>
          <input
            type="checkbox"
            name="toggle"
            id="minimize-tasks-toggle"
            class="toggle-checkbox"
            [checked]="settingsService.minimizeTasks()"
            (change)="settingsService.toggleMinimizeTasks()"
          />
          <label for="minimize-tasks-toggle">
            {{ 'settings.minimizeTasks' | transloco }}
          </label>
        </div>
      </div>
    </div>

    @if (showConfirmationPopup()) {
    <app-confirmation-popup
      [message]="confirmationMessage()"
      (confirm)="handleConfirmation($event)"
    ></app-confirmation-popup>
    }
  `,
})
export default class SettingsComponent {
  private translocoService = inject(TranslocoService);
  categoriesService = inject(CategoriesService);
  tasksStore = inject(TasksStore);
  settingsService = inject(SettingsService);
  currentLanguage = signal(this.translocoService.getActiveLang());
  isDarkMode = signal(false);
  faTrash = faTrash;
  faDownload = faDownload;
  faUpload = faUpload;

  showConfirmationPopup = signal(false);
  confirmationMessage = signal('');
  actionToConfirm: 'clearCompleted' | 'clearPastDated' | 'clearAllData' | null =
    null;

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
      this.isDarkMode.set(
        window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
      );
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

  addCategory(category: string) {
    if (category) {
      this.categoriesService.addCategory(category);
    }
  }

  removeCategory(category: string) {
    this.categoriesService.removeCategory(category);
  }

  exportData() {
    const data = {
      tasks: localStorage.getItem('tasks'),
      categories: localStorage.getItem('categories'),
      darkMode: localStorage.getItem('darkMode'),
      lang: localStorage.getItem('translocoLang'),
      minimizeTasks: this.settingsService.minimizeTasks(),
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-list-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importData(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(reader.result as string);
          if (importedData.tasks) {
            localStorage.setItem('tasks', importedData.tasks);
            this.tasksStore.setTasks(JSON.parse(importedData.tasks)); // Actualizar el store de tareas
          }
          if (importedData.categories) {
            localStorage.setItem('categories', importedData.categories);
            this.categoriesService.setCategories(
              JSON.parse(importedData.categories)
            ); // Actualizar el servicio de categorías
          }
          if (importedData.darkMode) {
            localStorage.setItem('darkMode', importedData.darkMode);
            this.isDarkMode.set(importedData.darkMode === 'true');
            this.updateDarkMode();
          }
          if (importedData.lang) {
            localStorage.setItem('translocoLang', importedData.lang);
            this.translocoService.setActiveLang(importedData.lang);
          }
          if (importedData.minimizeTasks) {
            this.settingsService.setMinimizeTasks(
              importedData.minimizeTasks === 'true'
            );
          }
          alert('Datos importados correctamente.');
        } catch (error) {
          alert(
            'Error al importar los datos. Asegúrate de que el archivo es un JSON válido.'
          );
          console.error('Error importing data:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  confirmClearCompletedTasks() {
    this.confirmationMessage.set('settings.confirmClearCompleted');
    this.actionToConfirm = 'clearCompleted';
    this.showConfirmationPopup.set(true);
  }

  confirmClearPastDatedTasks() {
    this.confirmationMessage.set('settings.confirmClearPastDated');
    this.actionToConfirm = 'clearPastDated';
    this.showConfirmationPopup.set(true);
  }

  confirmClearAllData() {
    this.confirmationMessage.set('settings.confirmClearAllData');
    this.actionToConfirm = 'clearAllData';
    this.showConfirmationPopup.set(true);
  }

  handleConfirmation(confirmed: boolean) {
    this.showConfirmationPopup.set(false);
    if (confirmed && this.actionToConfirm) {
      if (this.actionToConfirm === 'clearCompleted') {
        this.tasksStore.clearCompletedTasks();
      } else if (this.actionToConfirm === 'clearPastDated') {
        this.tasksStore.clearPastDatedTasks();
      } else if (this.actionToConfirm === 'clearAllData') {
        localStorage.clear();
        this.tasksStore.setTasks([]);
        this.categoriesService.setCategories([]);
        this.isDarkMode.set(false);
        this.settingsService.setMinimizeTasks(false);
        this.translocoService.setActiveLang('en');
        alert(this.translocoService.translate('settings.allDataCleared'));
      }
    }
    this.actionToConfirm = null;
  }

  private updateDarkMode() {
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
