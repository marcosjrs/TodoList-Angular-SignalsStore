import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksStore } from './tasks.store';
import { DayOfWeek, Task, TaskStatus } from './task.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <button (click)="toggleFormVisibility()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-sm mb-4">
        {{ showForm() ? 'Hide Form' : 'Show Form' }}
      </button>

      @if (showForm()) {
        <form [formGroup]="taskForm" (ngSubmit)="addTask()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
            <input id="description" formControlName="description" placeholder="Description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="durationSeconds" class="block text-gray-700 text-sm font-bold mb-2">Duration (seconds):</label>
            <input id="durationSeconds" formControlName="durationSeconds" placeholder="Duration (seconds)" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <div class="mb-4">
            <label for="daysOfWeek" class="block text-gray-700 text-sm font-bold mb-2">Days of Week:</label>
            <select id="daysOfWeek" formControlName="daysOfWeek" multiple class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              @for (day of daysOfWeek; track day) {
                <option [value]="day">{{ day }}</option>
              }
            </select>
          </div>
          <div class="mb-4">
            <label for="specificDate" class="block text-gray-700 text-sm font-bold mb-2">Specific Date:</label>
            <input id="specificDate" type="date" formControlName="specificDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          </div>
          <button type="submit" [disabled]="taskForm.invalid" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400">
            Add Task
          </button>
        </form>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        @for (task of tasksStore.tasks(); track task.id) {
          <div class="bg-white shadow-md rounded p-4">
            <h3 class="font-bold text-lg mb-2">{{ task.description }}</h3>
            <p class="text-gray-700 text-base mb-2">{{ task.durationSeconds }}s - {{ task.status }}</p>
            @if (task.daysOfWeek && task.daysOfWeek.length > 0) {
              <p class="text-gray-600 text-sm mb-2">Days: {{ task.daysOfWeek.join(', ') }}</p>
            }
            @if (task.specificDate) {
              <p class="text-gray-600 text-sm mb-2">Date: {{ task.specificDate | date:'shortDate' }}</p>
            }
            <div class="flex justify-end space-x-2">
              @if (task.status === TaskStatus.NotStarted || task.status === TaskStatus.Paused) {
                <button (click)="tasksStore.startTask(task.id)" class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-xs">Start</button>
              }
              @if (task.status === TaskStatus.InProgress) {
                <button (click)="tasksStore.pauseTask(task.id)" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded text-xs">Pause</button>
              }
              @if (task.status === TaskStatus.Completed || task.status === TaskStatus.InProgress || task.status === TaskStatus.Paused) {
                <button (click)="tasksStore.resetTask(task.id)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded text-xs">Reset</button>
              }
              <button (click)="tasksStore.removeTask(task.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs">Remove</button>
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
  readonly TaskStatus = TaskStatus;
  readonly daysOfWeek = Object.values(DayOfWeek);

  showForm = signal(false);

  taskForm = this.fb.group({
    description: ['', Validators.required],
    durationSeconds: [0, [Validators.required, Validators.min(1)]],
    daysOfWeek: [[] as DayOfWeek[]],
    specificDate: [''],
  });

  addTask() {
    if (this.taskForm.valid) {
      const { description, durationSeconds, daysOfWeek, specificDate } = this.taskForm.value;
      const newTask: Task = {
        id: Math.random().toString(36).substring(2),
        description: description!,
        durationSeconds: durationSeconds!,
        initialDurationSeconds: durationSeconds!,
        isCompleted: false,
        status: TaskStatus.NotStarted,
        daysOfWeek: daysOfWeek || undefined,
        specificDate: specificDate ? new Date(specificDate) : undefined,
      };
      this.tasksStore.addTask(newTask);
      this.taskForm.reset({
        description: '',
        durationSeconds: 0,
        daysOfWeek: [],
        specificDate: '',
      });
      this.showForm.set(false); // Hide form after adding task
    }
  }

  toggleFormVisibility() {
    this.showForm.update((value) => !value);
  }
}