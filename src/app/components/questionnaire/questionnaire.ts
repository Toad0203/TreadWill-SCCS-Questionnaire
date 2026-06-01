import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './questionnaire.html',
  styleUrl: './questionnaire.css',
})
export class Questionnaire implements OnInit {
  @Input() questionnaireId!: number;
  @Input() questionnaireType!: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log(this.questionnaireId);

    this.getQuestionnaire();
  }

  getQuestionnaire() {
    this.questionnaireData$ = this.http.get(
      `http://10.10.10.41:8000/api/questionnaires/${this.questionnaireId}/`,
    );

    this.questionnaireData$.subscribe((response: any) => {
      this.questions = response.questions;

      this.groupQuestions();

      this.initializeAnswers();
    });
  }

  groupQuestions() {
    this.groupedQuestions = [];

    if (this.questionnaireType === 'sccs') {
      for (let i = 0; i < this.questions.length; i += 6) {
        const group = this.questions.slice(i, i + 6);

        const scenario = group[0].text
          .split('|')[0]
          .replace(/\[Scenario \d+\]/, '')
          .trim();

        const reactions = group.map((item: any) => {
          return {
            id: item.id,

            reaction: item.text.split('|')[1].trim(),

            choices: item.choices,
          };
        });

        this.groupedQuestions.push({
          title: scenario,

          reactions,
        });
      }
    } else {
      this.questions.forEach((question: any) => {
        this.groupedQuestions.push({
          title: question.text.split('|')[0].trim(),

          reactions: [
            {
              id: question.id,
              reaction: null,
              choices: question.choices,
            },
          ],
        });
      });
    }
  }

  initializeAnswers() {
    this.groupedQuestions.forEach((question: any) => {
      question.reactions.forEach((reaction: any) => {
        this.answers[reaction.id] = null;
      });
    });
  }

  currentStep = 0;

  questionnaireData$!: Observable<any>;

  questions: any[] = [];

  groupedQuestions: any[] = [];

  answers: any = {};

  get currentQuestion() {
    return this.groupedQuestions[this.currentStep - 1];
  }

  showValidationError = false;
  isCurrentQuestionAnswered(): boolean {
    return this.currentQuestion.reactions.every((reaction: any) => this.answers[reaction.id]);
  }

  visitedQuestions = new Set<number>();

  nextQuestion() {
    if (this.currentStep > 0 && !this.isCurrentQuestionAnswered()) {
      this.showValidationError = true;

      return;
    }

    this.showValidationError = false;

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

    const formattedAnswers = Object.entries(this.answers).map(([questionId, choiceId]) => {
      return {
        question_id: Number(questionId),
        choice_id: choiceId,
      };
    });

    const payload = {
      questionnaire_id: this.questionnaireId,
      answers: formattedAnswers,
    };

    console.log(payload);

    this.http.post('http://10.10.10.41:8000/api/questionnaires/submit/', payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('Questionnaire submitted successfully.');
      },

      error: (error) => {
        console.error(error);

        alert(error?.error?.error ?? 'Unable to submit questionnaire.');
      },
    });
  }

  get progressPercentage(): number {
    return ((this.currentStep - 1) / this.groupedQuestions.length) * 100;
  }
}
