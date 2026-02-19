export type QuestionType = 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';


// Single question in a form
export interface FormQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required?: boolean;
  options?: string[]; 
}


// Complete form with questions
export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: FormQuestion[];
  createdAt?: string;
}

// Input type wich sends to server
export interface FormInput {
  title: string;
  description?: string;
  questions: FormQuestionInput[];
}

// Input type for one question
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
