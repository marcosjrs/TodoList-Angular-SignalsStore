import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksStore } from './tasks.store';
import { Task, TaskStatus } from './task.model';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="taskForm" (ngSubmit)="addTask()">
      <input formControlName="description" placeholder="Description" />
      <input formControlName="durationSeconds" placeholder="Duration (seconds)" type="number" />
      <button type="submit" [disabled]="taskForm.invalid">Add Task</button>
    </form>

    <ul>
      @for (task of tasksStore.tasks(); track task.id) {
        <li>
          {{ task.description }} - {{ task.durationSeconds }}s - {{ task.status }}
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

  taskForm = this.fb.group({
    description: ['', Validators.required],
    durationSeconds: [0, [Validators.required, Validators.min(1)]],
  });

  addTask() {
    if (this.taskForm.valid) {
      const { description, durationSeconds } = this.taskForm.value;
      const newTask: Task = {
        id: Math.random().toString(36).substring(2),
        description: description!,
        durationSeconds: durationSeconds!,
        initialDurationSeconds: durationSeconds!,
        isCompleted: false,
        status: TaskStatus.NotStarted,
      };
      this.tasksStore.addTask(newTask);
      this.taskForm.reset();
    }
  }
}