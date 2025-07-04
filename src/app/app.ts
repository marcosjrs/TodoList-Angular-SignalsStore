import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoModule],
  providers: [TranslocoService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'TodoList';
}
