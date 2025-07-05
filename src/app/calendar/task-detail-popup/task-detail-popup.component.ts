import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskStatus, DayOfWeek } from '../../tasks/task.model';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  selector: 'app-task-detail-popup',
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <button (click)="close.emit()" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
        <h3 class="text-xl font-bold mb-4">{{'tasks.taskDetails' | transloco}}</h3>
        @if (task) {
          <p><strong>{{'tasks.description' | transloco}}:</strong> {{ task.description }}</p>
          @if (task.durationSeconds) {
            <p><strong>{{'tasks.duration' | transloco}}:</strong> {{ task.durationSeconds }}s</p>
          }
          @if (task.category) {
            <p><strong>{{'tasks.category' | transloco}}:</strong> {{ task.category }}</p>
          }
          @if (task.daysOfWeek && task.daysOfWeek.length > 0) {
            <p><strong>{{'tasks.daysOfWeek' | transloco}}:</strong>
              @for (day of task.daysOfWeek; track day; let last = $last) {
                {{ day | transloco }}@if(!last){, }
              }
            </p>
          }
          @if (task.specificDate) {
            <p><strong>{{'tasks.specificDate' | transloco}}:</strong> {{ task.specificDate | date:'dd/MM/yyyy' }}</p>
          }
          <p><strong>{{'tasks.status' | transloco}}:</strong> {{ task.status | transloco }}</p>
          <div class="flex items-center mb-2">
            <input type="checkbox" [checked]="task.isCompleted" (change)="toggleCompleted.emit({ taskId: task.id, isCompleted: $any($event.target)?.checked })" class="mr-2">
            <label>{{'tasks.completed' | transloco}}</label>
          </div>
          <div class="flex justify-end mt-4">
            <button (click)="deleteTask.emit(task.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{{'tasks.deleteTask' | transloco}}</button>
          </div>
        }
      </div>
    </div>
  `,
})
export class TaskDetailPopupComponent {
  @Input() task: Task | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() deleteTask = new EventEmitter<string>();
  @Output() toggleCompleted = new EventEmitter<{ taskId: string, isCompleted: boolean }>();

  readonly TaskStatus = TaskStatus;
  readonly DayOfWeek = DayOfWeek;
}
