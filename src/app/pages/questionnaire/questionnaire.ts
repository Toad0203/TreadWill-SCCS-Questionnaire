import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-questionnaire',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css',
})
export class Questionnaire {
  constructor() {
    this.questions.forEach((question) => {
      this.answers[question.id] = {};
    });
  }

  currentStep = 0;

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

  answers: any = {};

  get currentQuestion() {
    return this.questions[this.currentStep - 1];
  }

  nextQuestion() {
    if (this.currentStep > 0 && !this.isCurrentQuestionAnswered()) {
      alert('Please answer all reactions.');

      return;
    }

    this.currentStep++;

    if (this.currentStep <= this.questions.length) {
      const hasAnswered = this.reactions.some(
        (reaction) => this.answers[this.currentQuestion.id][reaction],
      );

      if (!hasAnswered) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  }

  previousQuestion() {
    this.currentStep--;
  }

  isCurrentQuestionAnswered(): boolean {
    const currentAnswers = this.answers[this.currentQuestion.id];

    if (!currentAnswers) {
      return false;
    }

    return this.reactions.every((reaction) => currentAnswers[reaction]);
  }

  onSubmit() {
    alert('Questionnaire submitted successfully.');

    console.log(this.answers);
  }

  get progressPercentage(): number {
    return ((this.currentStep - 1) / this.questions.length) * 100;
  }
}
