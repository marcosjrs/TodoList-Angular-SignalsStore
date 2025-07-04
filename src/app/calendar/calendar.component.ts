import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksStore } from '../tasks/tasks.store';
import { Task } from '../tasks/task.model';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TaskDetailPopupComponent } from './task-detail-popup/task-detail-popup.component';

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoModule, TaskDetailPopupComponent],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <button (click)="previousMonth()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">&lt;</button>
        <h2 class="text-xl font-bold">{{ currentMonthYear() }}</h2>
        <button (click)="nextMonth()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">&gt;</button>
      </div>

      <div class="grid grid-cols-7 gap-2 text-center font-bold mb-2">
        <div>{{'Sun' | transloco}}</div>
        <div>{{'Mon' | transloco}}</div>
        <div>{{'Tue' | transloco}}</div>
        <div>{{'Wed' | transloco}}</div>
        <div>{{'Thu' | transloco}}</div>
        <div>{{'Fri' | transloco}}</div>
        <div>{{'Sat' | transloco}}</div>
      </div>

      <div class="grid grid-cols-7 gap-2">
        @for (day of calendarDays(); track $index) {
          <div class="p-2 border rounded" [class.bg-gray-100]="!day.date">
            @if (day.date) {
              <div class="font-bold">{{ day.date.getDate() }}</div>
              @for (task of day.tasks; track task.id) {
                <div class="task text-xs bg-blue-200 rounded px-1 py-0.5 mt-1 truncate" (click)="showTaskDetails(task)">{{ task.description }}</div>
              }
            }
          </div>
        }
      </div>
    </div>

    @if (selectedTask()) {
      <app-task-detail-popup [task]="selectedTask()" (close)="closeTaskDetails()" (deleteTask)="deleteTaskAndClosePopup($event)"></app-task-detail-popup>
    }
  `,
})
export default class CalendarComponent {
  private readonly tasksStore = inject(TasksStore);
  currentDate = signal(new Date());
  selectedTask = signal<Task | null>(null);

  currentMonthYear = computed(() => {
    return this.currentDate().toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const numDaysInMonth = lastDayOfMonth.getDate();

    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday, 1 for Monday, etc.

    const days = [];

    // Add padding for days before the 1st of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null, tasks: [] });
    }

    // Add days of the month
    for (let i = 1; i <= numDaysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const tasksForDay = this.tasksStore.tasks().filter(task => {
        if (task.specificDate) {
          const taskDate = new Date(task.specificDate);
          return taskDate.getFullYear() === dayDate.getFullYear() &&
                 taskDate.getMonth() === dayDate.getMonth() &&
                 taskDate.getDate() === dayDate.getDate();
        }
        return false;
      });
      days.push({ date: dayDate, tasks: tasksForDay });
    }

    return days;
  });

  previousMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentDate();
    this.currentDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  showTaskDetails(task: Task) {
    this.selectedTask.set(task);
  }

  closeTaskDetails() {
    this.selectedTask.set(null);
  }

  deleteTaskAndClosePopup(taskId: string) {
    this.tasksStore.removeTask(taskId);
    this.closeTaskDetails();
  }
}
