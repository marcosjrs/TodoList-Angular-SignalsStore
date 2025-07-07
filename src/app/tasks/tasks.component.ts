import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksStore } from './tasks.store';
import { DayOfWeek, Task, TaskStatus } from './task.model';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { CategoriesService } from '../settings/categories.service';
import { SettingsService } from '../shared/settings.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faPause, faRedo, faTrash, faPlus, faEye, faEyeSlash, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslocoModule, FontAwesomeModule],
  templateUrl: './tasks.component.html',
})
export default class TasksComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly tasksStore = inject(TasksStore);
  readonly categoriesService = inject(CategoriesService);
  readonly settingsService = inject(SettingsService);
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
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

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
    sortBy: [''], // New form control for sorting
  });

  appliedFilters = signal({
    description: '',
    category: '',
    status: '',
    daysOfWeek: [] as DayOfWeek[],
    sortBy: '', // New signal for applied sorting
  });

  filteredTasks = computed(() => {
    const tasks = this.tasksStore.tasks();
    const filter = this.appliedFilters();

    let filtered = tasks.filter(task => {
      const matchesDescription = filter.description ? task.description.toLowerCase().includes(filter.description.toLowerCase()) : true;
      const matchesCategory = filter.category ? task.category === filter.category : true;
      const matchesStatus = filter.status ? task.status === filter.status : true;
      const matchesDaysOfWeek = filter.daysOfWeek.length === 0 ||
        filter.daysOfWeek.some(day => day ===DayOfWeek.None) ||
        (filter.daysOfWeek.length > 0 && task.daysOfWeek && filter.daysOfWeek.some(day => task.daysOfWeek!.includes(day)));

      return matchesDescription && matchesCategory && matchesStatus && matchesDaysOfWeek;
    });

    // Sorting logic
    if (filter.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let valA: any;
        let valB: any;

        switch (filter.sortBy) {
          case 'description':
            valA = a.description?.toLowerCase() || '';
            valB = b.description?.toLowerCase() || '';
            break;
          case 'category':
            valA = a.category?.toLowerCase() || '';
            valB = b.category?.toLowerCase() || '';
            break;
          case 'specificDate':
            valA = a.specificDate ? new Date(a.specificDate).getTime() : Infinity;
            valB = b.specificDate ? new Date(b.specificDate).getTime() : Infinity;
            break;
          default:
            return 0;
        }

        if (valA === '' && valB !== '') return 1; // Empty values go to the end
        if (valA !== '' && valB === '') return -1; // Empty values go to the end

        if (valA < valB) return -1;
        if (valA > valB) return 1;
        return 0;
      });
    }

    return filtered;
  });

  constructor() {
    // Initialize appliedFilters with default values
    const { description, category, status, daysOfWeek, sortBy } = this.filterForm.value;
    this.appliedFilters.set({
      description: description ?? '',
      category: category ?? '',
      status: status ?? '',
      daysOfWeek: daysOfWeek ?? [],
      sortBy: sortBy ?? '',
    });
  }

  ngOnInit() {
    // Set initial minimized state for existing tasks based on settings
    const minimize = this.settingsService.minimizeTasks();
    this.tasksStore.tasks().forEach(task => {
      this.tasksStore.updateTask(task.id, { isMinimized: minimize });
    });
  }

  applyFilters() {
    const { description, category, status, daysOfWeek, sortBy } = this.filterForm.value;
    this.appliedFilters.set({
      description: description ?? '',
      category: category ?? '',
      status: status ?? '',
      daysOfWeek: daysOfWeek ?? [],
      sortBy: sortBy ?? '',
    });
    this.showFilterForm.set(false);
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
        isMinimized: this.settingsService.minimizeTasks(), // Initialize as minimized based on settings
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
    this.showForm.update((value) => {
      if (!value) { // If form is about to be shown
        this.showFilterForm.set(false); // Hide filter form
      }
      return !value;
    });
  }

  toggleFilterFormVisibility() {
    this.showFilterForm.update((value) => {
      if (!value) { // If filter form is about to be shown
        this.showForm.set(false); // Hide task form
      }
      return !value;
    });
  }

  toggleMinimize(taskId: string) {
    const currentTask = this.tasksStore.tasks().find(task => task.id === taskId);
    if (currentTask) {
      this.tasksStore.updateTask(taskId, { isMinimized: !currentTask.isMinimized });
    }
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

