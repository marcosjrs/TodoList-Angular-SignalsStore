import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TasksTimerService {
  private timers = new Map<string, number>();

  startTimer(taskId: string, onTick: () => void) {
    if (this.timers.has(taskId)) {
      return;
    }

    const timer = window.setInterval(() => {
      onTick();
    }, 1000);

    this.timers.set(taskId, timer);
  }

  pauseTimer(taskId: string) {
    if (this.timers.has(taskId)) {
      clearInterval(this.timers.get(taskId));
      this.timers.delete(taskId);
    }
  }
}