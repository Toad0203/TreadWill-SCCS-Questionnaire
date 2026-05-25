import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-questionnaire',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css',
})
export class Questionnaire {
  constructor(private http: HttpClient) {
    this.getQuestionnaire();
  }

  getQuestionnaire() {
    this.http.get('http://172.26.182.130:8000/api/questionnaires/1/').subscribe((response: any) => {
      this.questions = response.questions;

      this.groupQuestions();

      this.initializeAnswers();
    });
  }

  groupQuestions() {
    this.groupedQuestions = [];

    for (let i = 0; i < this.questions.length; i += 6) {
      const group = this.questions.slice(i, i + 6);

      const scenarioText = group[0].text
        .split('|')[0]
        .replace(/\[Scenario \d+\]/, '')
        .replace('&#8377;', '₹')
        .trim();

      this.groupedQuestions.push({
        scenario: scenarioText,

        reactions: group,
      });
    }
  }

  initializeAnswers() {
    this.groupedQuestions.forEach((question: any) => {
      question.reactions.forEach((reaction: any) => {
        this.answers[reaction.id] = reaction.choices[0].id;
      });
    });
  }

  currentStep = 0;

  questions: any[] = [];

  groupedQuestions: any[] = [];

  answers: any = {};

  get currentQuestion() {
    return this.groupedQuestions[this.currentStep - 1];
  }

  visitedQuestions = new Set<number>();

  nextQuestion() {
    this.currentStep++;

    if (this.currentStep <= this.questions.length && !this.visitedQuestions.has(this.currentStep)) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      this.visitedQuestions.add(this.currentStep);
    } else {
      this.scrollToBottom();
    }
  }

  previousQuestion() {
    this.currentStep--;

    this.scrollToBottom();
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  onSubmit() {
    alert('Questionnaire submitted successfully.');

    console.log(this.answers);
  }

  get progressPercentage(): number {
    return ((this.currentStep - 1) / this.groupedQuestions.length) * 100;
  }
}
