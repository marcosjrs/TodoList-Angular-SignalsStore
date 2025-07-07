import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import ChronoComponent from '../chrono/chrono.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ReactiveFormsModule,
    ChronoComponent,
  ],
  template: `
    <div class="container mx-auto p-4">

      <form
        [hidden]="!showForm()"
        [formGroup]="form"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label for="series" class="block text-gray-700 text-sm font-bold mb-2"
            >¿Cuántas series?</label
          >
          <input
            id="series"
            type="number"
            formControlName="series"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              for="hours"
              class="block text-gray-700 text-sm font-bold mb-2"
              >Horas</label
            >
            <input
              id="hours"
              type="number"
              formControlName="hours"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              for="minutes"
              class="block text-gray-700 text-sm font-bold mb-2"
              >Minutos</label
            >
            <input
              id="minutes"
              type="number"
              formControlName="minutes"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              for="seconds"
              class="block text-gray-700 text-sm font-bold mb-2"
              >Segundos</label
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
        (click)="onSubmit()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Aceptar
        </button>
        <button
          (click)="resetForm()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold ml-2 py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Reset
        </button>
      </form>
      <button
        [hidden]="showForm()"
        (click)="showForm.set(true)"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mb-4"
      >Mostrar formulario</button>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        @for (alarm of alarms(); track $index) {
        <app-chrono
          [hhmmss]="hhmmss"
          [inSeries]="true"
          (finish)="onFinish($index)"
          [hideAlarmForm]="true"
          [autoplay]="$index > 0"
        ></app-chrono>
        }
      </div>
    </div>
  `,
})
export default class SeriesComponent {
  form = new FormBuilder().group({
    series: [1],
    hours: [0],
    minutes: [0],
    seconds: [0],
  });

  showForm = signal<boolean>(true);
  alarms = signal<string[]>([]);
  hhmmss = '00:00:00';

  onSubmit() {
    if (!this.isValidTime()) {
      return;
    }
    const { series, hours, minutes, seconds } = this.form.value;
    this.hhmmss = [
      this.pad(hours || 0),
      this.pad(minutes || 0),
      this.pad(seconds || 0),
    ].join(':');
    this.alarms.set(Array(1).fill(this.hhmmss));
    this.showForm.set(false);
  }

  onFinish(index: number) {
    const series = this.form.controls.series.value;
    if (series && series > this.alarms().length) {
      this.alarms.set(Array(this.alarms().length + 1).fill(this.hhmmss));
    } else {
      console.log('All series completed');
    }
  }

  resetForm() {
    this.form.reset({
      series: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    this.showForm.set(true);
    this.alarms.set([]);
    this.hhmmss = '00:00:00';
  }

  private isValidTime(): boolean{
    const { series, hours, minutes, seconds } = this.form.value;
    if (!series || (series && (series < 1 || series > 100))) {
      console.error('Series must be between 1 and 100');
      return false;
    }
    if (hours === null || minutes === null || seconds === null || hours === undefined || minutes === undefined || seconds === undefined) {
      console.error('Invalid time values');
      return false;
    } else if (hours < 0 || minutes < 0 || seconds < 0) {
      console.error('Time values must be non-negative');
      return false;
    } else if(hours + minutes + seconds === 0) {
      console.error('At least one time value must be greater than zero');
      return false;
    }
    return true;
  }

  private pad(num: number) {
    return num.toString().padStart(2, '0');
  }
}
