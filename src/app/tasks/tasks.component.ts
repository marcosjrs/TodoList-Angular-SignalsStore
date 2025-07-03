import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksStore } from './tasks.store';
import { DayOfWeek, Task, TaskStatus } from './task.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="addTask()">
      <input formControlName="description" placeholder="Description" />
      <input formControlName="durationSeconds" placeholder="Duration (seconds)" type="number" />
      <div>
        <label for="daysOfWeek">Days of Week:</label>
        <select id="daysOfWeek" formControlName="daysOfWeek" multiple>
          @for (day of daysOfWeek; track day) {
            <option [value]="day">{{ day }}</option>
          }
        </select>
      </div>
      <div>
        <label for="specificDate">Specific Date:</label>
        <input id="specificDate" type="date" formControlName="specificDate" />
      </div>
      <button type="submit" [disabled]="taskForm.invalid">Add Task</button>
    </form>

    <ul>
      @for (task of tasksStore.tasks(); track task.id) {
        <li>
          {{ task.description }} - {{ task.durationSeconds }}s - {{ task.status }}
          @if (task.daysOfWeek && task.daysOfWeek.length > 0) {
            <span>- Days: {{ task.daysOfWeek.join(', ') }}</span>
          }
          @if (task.specificDate) {
            <span>- Date: {{ task.specificDate | date:'shortDate' }}</span>
          }
          @if (task.status === TaskStatus.NotStarted || task.status === TaskStatus.Paused) {
            <button (click)="tasksStore.startTask(task.id)">Start</button>
          }
          @if (task.status === TaskStatus.InProgress) {
            <button (click)="tasksStore.pauseTask(task.id)">Pause</button>
          }
          @if (task.status === TaskStatus.Completed || task.status === TaskStatus.InProgress || task.status === TaskStatus.Paused) {
            <button (click)="tasksStore.resetTask(task.id)">Reset</button>
          }
          <button (click)="tasksStore.removeTask(task.id)">Remove</button>
        </li>
      }
    </ul>
  `,
})
export default class TasksComponent {
  private readonly fb = inject(FormBuilder);
  readonly tasksStore = inject(TasksStore);
  readonly TaskStatus = TaskStatus;
  readonly daysOfWeek = Object.values(DayOfWeek);

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
    }
  }
}
