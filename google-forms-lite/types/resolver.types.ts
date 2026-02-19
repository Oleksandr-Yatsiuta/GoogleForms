import type { QuestionInput, AnswerInput } from './form.types';

export interface CreateFormArgs {
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

export interface UpdateFormArgs {
  id: string;
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

export interface SubmitResponseArgs {
  formId: string;
  answers: AnswerInput[];
}