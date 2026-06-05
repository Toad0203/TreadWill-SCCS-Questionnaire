import { Component } from '@angular/core';
import { Questionnaire } from '../../components/questionnaire/questionnaire';

@Component({
  selector: 'app-vas-page',
  imports: [Questionnaire],
  templateUrl: './vas-page.html',
  styleUrl: './vas-page.css',
})
export class VasPage {}
