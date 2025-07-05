import { Component, Input, Output, EventEmitter, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  selector: 'app-confirmation-popup',
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div class="relative p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 class="text-xl font-bold mb-4">{{'settings.confirmation' | transloco}}</h3>
        <p class="mb-4">{{ message() | transloco }}</p>
        <div class="flex justify-end space-x-2">
          <button (click)="confirm.emit(true)" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">{{'settings.confirm' | transloco}}</button>
          <button (click)="confirm.emit(false)" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">{{'settings.cancel' | transloco}}</button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmationPopupComponent {
  message = input('');
  confirm = output<boolean>();
}
