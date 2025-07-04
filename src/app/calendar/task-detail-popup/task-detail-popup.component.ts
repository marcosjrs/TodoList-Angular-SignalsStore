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
        <h3 class="text-xl font-bold mb-4">{{'Task Details' | transloco}}</h3>
        @if (task) {
          <p><strong>{{'Description' | transloco}}:</strong> {{ task.description }}</p>
          @if (task.durationSeconds) {
            <p><strong>{{'Duration (seconds)' | transloco}}:</strong> {{ task.durationSeconds }}s</p>
          }
          @if (task.category) {
            <p><strong>{{'Category' | transloco}}:</strong> {{ task.category }}</p>
          }
          @if (task.daysOfWeek && task.daysOfWeek.length > 0) {
            <p><strong>{{'Days of Week' | transloco}}:</strong>
              @for (day of task.daysOfWeek; track day; let last = $last) {
                {{ day | transloco }}@if(!last){, }
              }
            </p>
          }
          @if (task.specificDate) {
            <p><strong>{{'Specific Date' | transloco}}:</strong> {{ task.specificDate | date:'shortDate' }}</p>
          }
          <p><strong>{{'Status' | transloco}}:</strong> {{ task.status | transloco }}</p>
          <p><strong>{{'Completed' | transloco}}:</strong> {{ task.isCompleted ? ('Yes' | transloco) : ('No' | transloco) }}</p>
          <div class="flex justify-end mt-4">
            <button (click)="deleteTask.emit(task.id)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{{'Delete Task' | transloco}}</button>
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

  readonly TaskStatus = TaskStatus;
  readonly DayOfWeek = DayOfWeek;
}
