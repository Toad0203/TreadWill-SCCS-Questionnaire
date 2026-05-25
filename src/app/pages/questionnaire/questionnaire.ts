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
    // this.getQuestionnaire();

    this.questions.forEach((question) => {
      this.answers[question.id] = {};

      this.reactions.forEach((reaction) => {
        this.answers[question.id][reaction] = 1;
      });
    });
  }

  // getQuestionnaire() {
  //   this.http.get('http://172.26.182.130:8000/api/questionnaires/1/').subscribe((response) => {
  //     this.questions = response.questions;
  //     console.log(this.questions);
  //   });
  // }

  questions = [
    {
      id: 1,
      situation: 'You arrive home to find that you have left your keys at work.',
    },
    {
      id: 2,
      situation: 'You receive a letter in the post that is an unpaid bill reminder.',
    },
    {
      id: 3,
      situation: 'You have just dropped and scratched your new smartphone.',
    },
    {
      id: 4,
      situation:
        'You have just opened the washing machine door to find that your white wash has turned pink.',
    },
    {
      id: 5,
      situation: 'After searching your bag, you realize that you have lost a £20 note.',
    },
  ];

  reactions = ['Reassuring', 'Soothing', 'Contemptuous', 'Compassionate', 'Critical', 'Harsh'];
  scaleValues = [1, 2, 3, 4, 5, 6, 7];

  currentStep = 0;

  // questions: any[] = [];

  answers: any = {};

  get currentQuestion() {
    return this.questions[this.currentStep - 1];
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
    return ((this.currentStep - 1) / this.questions.length) * 100;
  }
}
