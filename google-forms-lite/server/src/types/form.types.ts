// Describes a single question in a form.
export interface Question {
    id: string;
    title: string;
    type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
    options?: string[];
    required: boolean;
}

// Describes a form with metadata and questions.
export interface Form {
    id: string;
    title: string;
    description?: string;
    questions: Question[];
    createdAt: string;
}

// Describes an answer to one question.
export interface Answer {
    questionId: string;
    value: string | string[];
}

// Describes a submitted response for a form.
export interface Response {
    id: string;
    formId: string;
    answers: Answer[];
    submittedAt: string;
}