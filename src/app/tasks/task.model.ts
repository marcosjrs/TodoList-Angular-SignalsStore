export interface Task {
  id: string;
  description: string;
  durationSeconds?: number;
  initialDurationSeconds?: number;
  isCompleted: boolean;
  status: TaskStatus;
  daysOfWeek?: DayOfWeek[];
  specificDate?: Date;
  category?: string;
}

export enum DayOfWeek {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

export enum TaskStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Paused = 'PAUSED',
  Completed = 'COMPLETED',
}