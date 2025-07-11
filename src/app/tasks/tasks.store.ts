import { computed, inject, effect } from '@angular/core';
import {
  patchState,
  signalStore,
  withState,
  withMethods,
  withComputed,
  withHooks,
} from '@ngrx/signals';
import { Task, TaskStatus } from './task.model';
import { TasksTimerService } from './tasks-timer.service';
import { AlarmService } from '../shared/alarm.service';

export interface TasksState {
  tasks: Task[];
}

const getInitialState = (): TasksState => {
  const storedTasks = localStorage.getItem('tasks');
  return {
    tasks: storedTasks ? JSON.parse(storedTasks) : [],
  };
};

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState(getInitialState()),
  withComputed(({ tasks }) => ({
    completedTasks: computed(() => tasks().filter((task) => task.isCompleted)),
    uncompletedTasks: computed(() =>
      tasks().filter((task) => !task.isCompleted)
    ),
  })),
  withMethods((store) => {
    const timerService = inject(TasksTimerService);
    return {
      addTask(task: Task) {
        patchState(store, { tasks: [...store.tasks(), task] });
      },
      removeTask(id: string) {
        timerService.pauseTimer(id);
        patchState(store, {
          tasks: store.tasks().filter((task) => task.id !== id),
        });
      },
      updateTask(id: string, updatedTask: Partial<Task>) {
        patchState(store, {
          tasks: store
            .tasks()
            .map((task) =>
              task.id === id ? { ...task, ...updatedTask } : task
            ),
        });
      },
      startTask(id: string) {
        patchState(store, {
          tasks: store
            .tasks()
            .map((task) =>
              task.id === id ? { ...task, status: TaskStatus.InProgress } : task
            ),
        });
        timerService.startTimer(id, () => {
          const task = store.tasks().find((t) => t.id === id);
          if (task) {
            if (task.durationSeconds && task.durationSeconds > 0) {
              patchState(store, {
                tasks: store
                  .tasks()
                  .map((t) =>
                    t.id === id
                      ? {
                          ...t,
                          durationSeconds: t.durationSeconds
                            ? t.durationSeconds - 1
                            : undefined,
                        }
                      : t
                  ),
              });
            } else {
              timerService.pauseTimer(id);
              patchState(store, {
                tasks: store.tasks().map((t) => {
                  console.log('Task completed:', t);
                  if (t.id === id) {
                    const alarmService = new AlarmService();
                    alarmService.playAlarmSoundNTimes(3, id);
                    return {
                      ...t,
                      status: TaskStatus.Completed,
                      isCompleted: true,
                    };
                  } else {
                    return t;
                  }
                }),
              });
            }
          }
        });
      },
      pauseTask(id: string) {
        patchState(store, {
          tasks: store
            .tasks()
            .map((task) =>
              task.id === id ? { ...task, status: TaskStatus.Paused } : task
            ),
        });
        timerService.pauseTimer(id);
      },
      resetTask(id: string) {
        timerService.pauseTimer(id);
        patchState(store, {
          tasks: store.tasks().map((task) =>
            task.id === id
              ? {
                  ...task,
                  status: TaskStatus.NotStarted,
                  durationSeconds: task.initialDurationSeconds,
                  isCompleted: false,
                }
              : task
          ),
        });
      },
      setTasks(tasks: Task[]) {
        patchState(store, { tasks });
      },
      clearCompletedTasks() {
        patchState(store, {
          tasks: store.tasks().filter((task) => !task.isCompleted),
        });
      },
      clearPastDatedTasks() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        patchState(store, {
          tasks: store.tasks().filter((task) => {
            if (task.specificDate) {
              const taskDate = new Date(task.specificDate);
              taskDate.setHours(0, 0, 0, 0);
              return taskDate >= today;
            }
            return true;
          }),
        });
      },
    };
  }),
  withHooks({
    onInit(store) {
      effect(() => {
        localStorage.setItem('tasks', JSON.stringify(store.tasks()));
      });
    },
  })
);
