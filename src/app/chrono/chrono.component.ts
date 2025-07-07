import { Component, signal, OnDestroy, inject, input, Input, output } from '@angular/core';
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
import { AlarmService } from '../shared/alarm.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    FontAwesomeModule,
  ],
  styleUrl: './chrono.component.scss',
  templateUrl: './chrono.component.html',
})
export default class ChronoComponent implements OnDestroy {
  elapsedTime = signal(0);
  isRunning = signal(false);
  showAlarmForm = signal(false);
  showAlarmMessage = signal(false);
  alarmTime = signal<number | null>(null);
  play = output<void>();

  @Input()
  set hhmmss(value: string | null) {
    if (value) {
      const [hours, minutes, seconds] = value.split(':').map(Number);
      if (
        this.alarmForm.value.hours !== hours ||
        this.alarmForm.value.minutes !== minutes ||
        this.alarmForm.value.seconds !== seconds
      ) {
        this.alarmForm.patchValue({ hours, minutes, seconds });
      }
    }
  }



  private timer: any;
  private readonly alarmService = inject(AlarmService);

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
  intervalPlaySound?: number;


  toggleTimer() {
    this.isRunning.update((running) => !running);
    if (this.isRunning()) {
      const startTime = Date.now() - this.elapsedTime();
      this.timer = setInterval(() => {
        this.elapsedTime.set(Date.now() - startTime);
        this.checkAlarm();
      });
      this.setAlarm(false);
    } else {
      clearInterval(this.timer);
    }
    if(this.elapsedTime()<1){
      this.play.emit();
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

  setAlarm(hideAlarmForm = true) {
    if (
      !this.alarmForm?.value?.hours &&
      !this.alarmForm.value?.minutes &&
      !this.alarmForm.value?.seconds
    ) {
      return;
    }
    const { hours, minutes, seconds } = this.alarmForm.value;
    const totalSeconds =
      (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);
    this.alarmTime.set(totalSeconds * 1000);
    if(hideAlarmForm) {
      this.showAlarmForm.set(false);
    }
  }

  checkAlarm() {
    if (this.alarmTime() !== null && this.elapsedTime() >= this.alarmTime()!) {
      this.alarmService.playAlarmSound();
      this.showAlarmMessage.set(true);
      this.intervalPlaySound = setInterval(() => {
        if (this.elapsedTime() && this.isRunning()) {
          this.alarmService.playAlarmSound();
        } else {
          this.showAlarmMessage.set(false);
          clearInterval(this.intervalPlaySound);
        }
      }, 3000);
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
