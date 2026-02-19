// Answer to a single question
export interface Answer {
  questionId: string;
  value: string | string[] | boolean;
}

// Complete form response with all answers
export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt?: string;
}

// Input type for submitting answers to the server
export interface AnswerInput {
  questionId: string;
  value: string | string[] | boolean;
}