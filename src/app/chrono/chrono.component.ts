import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPlay,
  faPause,
  faRedo,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    FontAwesomeModule,
  ],
  styleUrl: './chrono.component.scss',
  template: `
    <div class="app-container-center">
      <div
        class="container mx-auto p-4 text-center flex flex-col items-center justify-center h-full"
      >
        <div class="text-6xl font-mono mb-4">
          {{ formatTime(elapsedTime()) }}
        </div>
        <div class="space-x-2 mb-4">
          <button
            (click)="toggleTimer()"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <fa-icon [icon]="isRunning() ? faPause : faPlay"></fa-icon>
          </button>
          <button
            (click)="resetTimer()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            <fa-icon [icon]="faRedo"></fa-icon>
          </button>
        </div>

        <button
          (click)="toggleAlarmForm()"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm mb-4"
        >
          <fa-icon [icon]="showAlarmForm() ? faEyeSlash : faEye"></fa-icon>
          {{ 'chrono.alarm' | transloco }}
        </button>

        @if (showAlarmForm()) {
        <form
          [formGroup]="alarmForm"
          (ngSubmit)="setAlarm()"
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto"
        >
          <div class="flex justify-center space-x-2 mb-4">
            <div>
              <label
                for="hours"
                class="block text-gray-700 text-sm font-bold mb-2"
                >{{ 'chrono.hours' | transloco }}</label
              >
              <input
                id="hours"
                type="number"
                formControlName="hours"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                for="minutes"
                class="block text-gray-700 text-sm font-bold mb-2"
                >{{ 'chrono.minutes' | transloco }}</label
              >
              <input
                id="minutes"
                type="number"
                formControlName="minutes"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label
                for="seconds"
                class="block text-gray-700 text-sm font-bold mb-2"
                >{{ 'chrono.seconds' | transloco }}</label
              >
              <input
                id="seconds"
                type="number"
                formControlName="seconds"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ 'chrono.setAlarm' | transloco }}
          </button>
        </form>
        }
      </div>
    </div>
  `,
})
export default class ChronoComponent implements OnDestroy {
  elapsedTime = signal(0);
  isRunning = signal(false);
  showAlarmForm = signal(false);
  alarmTime = signal<number | null>(null);

  private timer: any;

  // Font Awesome icons
  faPlay = faPlay;
  faPause = faPause;
  faRedo = faRedo;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  alarmForm = new FormBuilder().group({
    hours: [0],
    minutes: [0],
    seconds: [0],
  });

  toggleTimer() {
    this.isRunning.update((running) => !running);
    if (this.isRunning()) {
      const startTime = Date.now() - this.elapsedTime();
      this.timer = setInterval(() => {
        this.elapsedTime.set(Date.now() - startTime);
        this.checkAlarm();
      });
    } else {
      clearInterval(this.timer);
    }
  }

  resetTimer() {
    this.isRunning.set(false);
    this.elapsedTime.set(0);
    this.alarmTime.set(null);
    clearInterval(this.timer);
  }

  toggleAlarmForm() {
    this.showAlarmForm.update((visible) => !visible);
  }

  setAlarm() {
    const { hours, minutes, seconds } = this.alarmForm.value;
    const totalSeconds =
      (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    this.alarmTime.set(totalSeconds * 1000);
    this.showAlarmForm.set(false);
  }

  checkAlarm() {
    if (this.alarmTime() !== null && this.elapsedTime() >= this.alarmTime()!) {
      alert('Alarm!');
      this.alarmTime.set(null); // Reset alarm after it goes off
    }
  }

  formatTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  private pad(num: number) {
    return num.toString().padStart(2, '0');
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
