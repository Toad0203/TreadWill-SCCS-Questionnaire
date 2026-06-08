import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getQuestionnaire();
  }

  url = 'http://10.10.10.41:8000/api/questionnaires';

  getQuestionnaire() {
    this.questionnaireData$ = this.http.get(`${this.url}/${this.questionnaireId}/`);

    this.questionnaireData$.subscribe((response: any) => {
      this.questions = response.questions;

      this.groupQuestions();

      this.initializeAnswers();
    });
  }

  groupQuestions() {
    if (this.questionnaireType === 'vas') {
      this.groupVasQuestions();
      return;
    }

    if (this.questionnaireType === 'sccs') {
      this.groupSccsQuestions();
      return;
    }

    this.groupFscrsQuestions();
  }

  initializeAnswers() {
    if (this.questionnaireType === 'vas') {
      this.groupedQuestions.forEach((question: any) => {
        this.answers[question.id] = null;
      });

      return;
    }

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
    // if (this.questionnaireType === 'vas') {
    //   return this.answers[this.currentQuestion.id] != null;
    // }
    if (this.questionnaireType === 'vas') {
      return true;
    }

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

    if (
      this.currentStep <= this.groupedQuestions.length &&
      !this.visitedQuestions.has(this.currentStep)
    ) {
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

    this.http.post(`${this.url}/submit/`, payload).subscribe({
      next: (response) => {
        console.log(response);
        alert('Questionnaire submitted successfully.');

        if (this.questionnaireType === 'fscrs') {
          this.router.navigate(['/sccs-questionnaire']);
        } else if (this.questionnaireType === 'sccs') {
          this.router.navigate(['/vas-questionnaire']);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (error) => {
        console.error(error);

        alert(error?.error?.error ?? 'Unable to submit questionnaire.');

        if (this.questionnaireType === 'fscrs') {
          this.router.navigate(['/sccs-questionnaire']);
        } else if (this.questionnaireType === 'sccs') {
          this.router.navigate(['/vas-questionnaire']);
        } else {
          this.router.navigate(['/']);
        }
      },
    });
  }

  get progressPercentage(): number {
    return ((this.currentStep - 1) / this.groupedQuestions.length) * 100;
  }

  onScaleClick(event: MouseEvent) {
    const scale = event.currentTarget as HTMLElement;

    const rect = scale.getBoundingClientRect();

    const percentage = ((event.clientX - rect.left) / rect.width) * 100;

    const value = Math.round(Math.max(0, Math.min(100, percentage)));

    const questionId = this.currentQuestion.id;

    this.answers[questionId] = value;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.nextQuestion();

      this.cdr.detectChanges();
    }, 750);
  }

  get sliderBackground() {
    const value = this.answers[this.currentQuestion?.id] ?? 0;

    return `linear-gradient(
    to right,
    #f5bb56 0%,
    #f5bb56 ${value}%,
    #d3d3d3 ${value}%,
    #d3d3d3 100%
  )`;
  }

  groupVasQuestions() {
    this.groupedQuestions = [];

    this.questions.forEach((question: any) => {
      this.groupedQuestions.push({
        id: question.id,
        title: question.text,
        choices: question.choices,
      });
    });
  }

  groupSccsQuestions() {
    this.groupedQuestions = [];

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
  }

  groupFscrsQuestions() {
    this.groupedQuestions = [];

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
