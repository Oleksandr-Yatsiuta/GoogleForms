export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export type FormQuestion = Question;

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt?: string;
}

export interface QuestionInput {
  id?: string;
  title: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export type FormQuestionInput = QuestionInput;

export interface FormInput {
  title: string;
  description?: string;
  questions: FormQuestionInput[];
}

export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface AnswerInput {
  questionId: string;
  value: string | string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt?: string;
}

export interface QuestionCardProps {
  question: FormQuestion;
  isEditing: boolean;
  onEdit: () => void;
  onUpdate: (updates: Partial<FormQuestion>) => void;
  onDelete: () => void;
  onAddOption: () => void;
  onUpdateOption: (optionIndex: number, value: string) => void;
  onDeleteOption: (optionIndex: number) => void;
}