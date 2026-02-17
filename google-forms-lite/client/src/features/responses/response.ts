export interface Answer {
  questionId: string;
  value: string | string[] | boolean;
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt?: string;
}

export interface AnswerInput {
  questionId: string;
  value: string | string[] | boolean;
}