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
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div>
        <label for="series">¿Cuántas series?</label>
        <input id="series" type="number" formControlName="series" />
      </div>
      <div>
        <label for="hours">Horas</label>
        <input id="hours" type="number" formControlName="hours" />
      </div>
      <div>
        <label for="minutes">Minutos</label>
        <input id="minutes" type="number" formControlName="minutes" />
      </div>
      <div>
        <label for="seconds">Segundos</label>
        <input id="seconds" type="number" formControlName="seconds" />
      </div>
      <button type="submit">Aceptar</button>
    </form>

    @for (alarm of alarms(); track $index) {
      <app-chrono [hhmmss]="hhmmss" [inSeries]="true" (finish)="onFinish($index)" [autoplay]="$index>0"></app-chrono>
    }
  `,
})
export default class SeriesComponent {
  form = new FormBuilder().group({
    series: [1],
    hours: [0],
    minutes: [0],
    seconds: [0],
  });

  alarms = signal<string[]>([]);
  hhmmss = '00:00:00';

  onSubmit() {
    const { series, hours, minutes, seconds } = this.form.value;
    this.hhmmss = [
      this.pad(hours || 0),
      this.pad(minutes || 0),
      this.pad(seconds || 0),
    ].join(':');
    this.alarms.set(Array(1).fill(this.hhmmss));
  }

  onFinish(index: number) {
    const series = this.form.controls.series.value;
    if(series && (series > this.alarms().length)) {
      this.alarms.set(Array(this.alarms().length+1).fill(this.hhmmss));
    }else {
      console.log('All series completed');
    }
  }

  private pad(num: number) {
    return num.toString().padStart(2, '0');
  }
}
