import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksStore } from './tasks.store';
import { DayOfWeek, Task, TaskStatus } from './task.model';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { CategoriesService } from '../settings/categories.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faPause, faRedo, faTrash, faPlus, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslocoModule, FontAwesomeModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between mb-4">
        <button (click)="toggleFormVisibility()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm">
          <fa-icon [icon]="showForm() ? faEyeSlash : faEye"></fa-icon> {{'Creation Form' | transloco}}
        </button>
        <button (click)="toggleFilterFormVisibility()" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-2 rounded text-sm">
          <fa-icon [icon]="showFilterForm() ? faEyeSlash : faEye"></fa-icon> {{'Filter Form' | transloco}}
        </button>
      </div>

      @if (showForm()) {
        <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label for="description" class="block text-gray-700 text-sm font-bold mb-2">{{'Description' | transloco}} *</label>
            <input id="description" formControlName="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="durationSeconds" class="block text-gray-700 text-sm font-bold mb-2">{{'Duration (seconds)' | transloco}}</label>
            <input id="durationSeconds" formControlName="durationSeconds" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="category" class="block text-gray-700 text-sm font-bold mb-2">{{'Category' | transloco}}</label>
            <select id="category" formControlName="category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">{{'None' | transloco}}</option>
              @for (category of categoriesService.categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>
          <div class="mb-4">
            <label for="daysOfWeek" class="block text-gray-700 text-sm font-bold mb-2">{{'Days of Week' | transloco}}</label>
            <select id="daysOfWeek" formControlName="daysOfWeek" multiple class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              @for (day of daysOfWeek; track day) {
                <option [value]="day">{{ day | transloco }}</option>
              }
            </select>
          </div>
          <div class="mb-4">
            <label for="specificDate" class="block text-gray-700 text-sm font-bold mb-2">{{'Specific Date' | transloco}}</label>
            <input id="specificDate" type="date" formControlName="specificDate" placeholder=" " class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <button type="submit" [disabled]="taskForm.invalid" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
            <fa-icon [icon]="faPlus"></fa-icon>
          </button>
        </form>
      }

      @if (showFilterForm()) {
        <form [formGroup]="filterForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label for="filterDescription" class="block text-gray-700 text-sm font-bold mb-2">{{'Filter by Description' | transloco}}</label>
            <input id="filterDescription" formControlName="description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="filterCategory" class="block text-gray-700 text-sm font-bold mb-2">{{'Filter by Category' | transloco}}</label>
            <select id="filterCategory" formControlName="category" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">{{'All Categories' | transloco}}</option>
              @for (category of categoriesService.categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>
          </div>
          <div class="mb-4">
            <label for="filterStatus" class="block text-gray-700 text-sm font-bold mb-2">{{'Filter by Status' | transloco}}</label>
            <select id="filterStatus" formControlName="status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">{{'All Statuses' | transloco}}</option>
              @for (status of taskStatuses; track status) {
                <option [value]="status">{{ status | transloco }}</option>
              }
            </select>
          </div>
          <div class="mb-4">
            <label for="filterDaysOfWeek" class="block text-gray-700 text-sm font-bold mb-2">{{'Filter by Days of Week' | transloco}}</label>
            <select id="filterDaysOfWeek" formControlName="daysOfWeek" multiple class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              @for (day of daysOfWeek; track day) {
                <option [value]="day">{{ day | transloco }}</option>
              }
            </select>
          </div>
          <button (click)="applyFilters()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            {{'Apply' | transloco}}
          </button>
        </form>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        @for (task of filteredTasks(); track task.id) {
          <div class="bg-white shadow-md rounded p-4" [class.opacity-50]="task.isCompleted">
            <h3 class="font-bold text-lg mb-2">{{ task.description }}</h3>
            @if (task.category) {
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 last:mr-0 mr-1">
                {{ task.category }}
              </span>
            }
            <p class="text-gray-700 text-base mb-2">@if (task.durationSeconds) { {{ task.durationSeconds }}s - } {{ task.status | transloco}}</p>
            @if (task.daysOfWeek && task.daysOfWeek.length > 0) {
              <p class="text-gray-600 text-sm mb-2"><span>{{'Days' | transloco}}</span>:
              @for (day of task.daysOfWeek; track day; let last = $last) {
                {{ day | transloco }} @if(!last){ <span>|</span>}
              }
            </p>
            }
            @if (task.specificDate) {
              <p class="text-gray-600 text-sm mb-2"><span>{{'Date' | transloco}}</span>: {{ task.specificDate | date:'shortDate' }}</p>
            }
            <div class="flex items-center mb-2">
              @if (task.status !== TaskStatus.InProgress) {
                <input type="checkbox" [checked]="task.isCompleted" (change)="toggleCompleted(task.id, $event)" class="mr-2">
                <label>{{'Completed' | transloco}}</label>
              }
            </div>
            <div class="flex justify-end space-x-2">
              @if (task.durationSeconds !== undefined && task.durationSeconds > 0) {
                @if (task.status === TaskStatus.NotStarted || task.status === TaskStatus.Paused) {
                  <button (click)="tasksStore.startTask(task.id)" [disabled]="task.isCompleted" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs disabled:bg-gray-400"><fa-icon [icon]="faPlay"></fa-icon></button>
                }
                @if (task.status === TaskStatus.InProgress) {
                  <button (click)="tasksStore.pauseTask(task.id)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs"><fa-icon [icon]="faPause"></fa-icon></button>
                }
                @if (task.status === TaskStatus.Completed || task.status === TaskStatus.InProgress || task.status === TaskStatus.Paused) {
                  <button (click)="tasksStore.resetTask(task.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs"><fa-icon [icon]="faRedo"></fa-icon></button>
                }
              }
              <button (click)="tasksStore.removeTask(task.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"><fa-icon [icon]="faTrash"></fa-icon></button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export default class TasksComponent {
  private readonly fb = inject(FormBuilder);
  readonly tasksStore = inject(TasksStore);
  readonly categoriesService = inject(CategoriesService);
  readonly TaskStatus = TaskStatus;
  readonly daysOfWeek = Object.values(DayOfWeek);
  readonly taskStatuses = Object.values(TaskStatus);

  // Font Awesome icons
  faPlay = faPlay;
  faPause = faPause;
  faRedo = faRedo;
  faTrash = faTrash;
  faPlus = faPlus;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  showForm = signal(false);
  showFilterForm = signal(false);

  taskForm = this.fb.group({
    description: ['', Validators.required],
    durationSeconds: [null], // durationSeconds is now optional
    daysOfWeek: [[] as DayOfWeek[]],
    specificDate: [''],
    category: [''],
  });

  filterForm = this.fb.group({
    description: [''],
    category: [''],
    status: [''],
    daysOfWeek: [[] as DayOfWeek[]],
  });

  appliedFilters = signal({
    description: '',
    category: '',
    status: '',
    daysOfWeek: [] as DayOfWeek[],
  });

  filteredTasks = computed(() => {
    const tasks = this.tasksStore.tasks();
    const filter = this.appliedFilters();

    return tasks.filter(task => {
      const matchesDescription = filter.description ? task.description.toLowerCase().includes(filter.description.toLowerCase()) : true;
      const matchesCategory = filter.category ? task.category === filter.category : true;
      const matchesStatus = filter.status ? task.status === filter.status : true;
      const matchesDaysOfWeek = filter.daysOfWeek.length > 0 ?
        (task.daysOfWeek && filter.daysOfWeek.every(day => task.daysOfWeek!.includes(day))) : true;

      return matchesDescription && matchesCategory && matchesStatus && matchesDaysOfWeek;
    });
  });

  constructor() {
    // Initialize appliedFilters with default values
    const { description, category, status, daysOfWeek } = this.filterForm.value;
    this.appliedFilters.set({
      description: description ?? '',
      category: category ?? '',
      status: status ?? '',
      daysOfWeek: daysOfWeek ?? [],
    });
  }

  applyFilters() {
    const { description, category, status, daysOfWeek } = this.filterForm.value;
    this.appliedFilters.set({
      description: description ?? '',
      category: category ?? '',
      status: status ?? '',
      daysOfWeek: daysOfWeek ?? [],
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      const { description, durationSeconds, daysOfWeek, specificDate, category } = this.taskForm.value;
      const newTask: Task = {
        id: Math.random().toString(36).substring(2),
        description: description!,
        durationSeconds: durationSeconds ?? undefined, // Make it optional
        initialDurationSeconds: durationSeconds ?? undefined, // Make it optional
        isCompleted: false,
        status: TaskStatus.NotStarted,
        daysOfWeek: daysOfWeek || undefined,
        specificDate: specificDate ? new Date(specificDate) : undefined,
        category: category || undefined,
      };
      this.tasksStore.addTask(newTask);
      this.taskForm.reset({
        description: '',
        durationSeconds: null, // Reset to null for optional field
        daysOfWeek: [],
        specificDate: '',
        category: '',
      });
      this.showForm.set(false); // Hide form after adding task
    }
  }

  toggleFormVisibility() {
    this.showForm.update((value) => !value);
  }

  toggleFilterFormVisibility() {
    this.showFilterForm.update((value) => !value);
  }

  toggleCompleted(taskId: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const currentTask = this.tasksStore.tasks().find(task => task.id === taskId);

    if (!isChecked && currentTask && currentTask.initialDurationSeconds !== undefined && currentTask.initialDurationSeconds > 0) {
      // If unchecked and it was a timed task, reset time and status
      this.tasksStore.updateTask(taskId, {
        isCompleted: isChecked,
        durationSeconds: currentTask.initialDurationSeconds,
        status: TaskStatus.NotStarted,
      });
    } else {
      // Otherwise, just update completion status
      this.tasksStore.updateTask(taskId, {
        isCompleted: isChecked,
        status: isChecked ? TaskStatus.Completed : TaskStatus.NotStarted,
      });
    }
  }
}
