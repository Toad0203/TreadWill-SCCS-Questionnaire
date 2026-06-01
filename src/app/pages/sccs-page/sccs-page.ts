import { Component } from '@angular/core';
import { Questionnaire } from '../../components/questionnaire/questionnaire';

@Component({
  selector: 'app-sccs-page',
  standalone: true,
  imports: [Questionnaire],
  templateUrl: './sccs-page.html',
  styleUrl: './sccs-page.css',
})
export class SccsPage {}
