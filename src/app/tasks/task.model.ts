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
  isMinimized?: boolean;
}

export enum DayOfWeek {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  None = 'NONE', // Used for tasks that are not specific to any day of the week
}

export enum TaskStatus {
  NotStarted = 'NOT_STARTED',
  InProgress = 'IN_PROGRESS',
  Paused = 'PAUSED',
  Completed = 'COMPLETED',
}
