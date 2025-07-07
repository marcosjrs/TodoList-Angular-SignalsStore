import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AlarmService {
  timesById: { [id: string]: number } = {};

  async playAlarmSound(): Promise<void> {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar el sonido
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Nota LA (440Hz)

      // Configurar el volumen
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      // Reproducir el sonido durante 1 segundo
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Error al reproducir el sonido de alarma:', error);
    }
  }



  async playAlarmSoundNTimes(n: number, id:string): Promise<void> {
    for (let i = 0; i < n; i++) {
      if (this.timesById[id] && this.timesById[id] >= n) {
        delete this.timesById[id];
        return;
      }
      await this.playAlarmSound();
      this.timesById[id] = (this.timesById[id] || 0) + 1; // Incrementar el contador de reproducciones
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 1000 ms (1 segundo) entre reproducciones
    }
  }

}
