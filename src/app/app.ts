import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Questionnaire } from './pages/questionnaire/questionnaire';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Questionnaire],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('treadwill-questionnaire');
}
