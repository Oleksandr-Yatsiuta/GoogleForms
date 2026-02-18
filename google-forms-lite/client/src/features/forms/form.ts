export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';

export interface FormQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: string[]; 
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  createdAt?: string;
}

export interface FormInput {
  title: string;
  description?: string;
  questions: FormQuestionInput[];
}

export interface FormQuestionInput {
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: string[];
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
