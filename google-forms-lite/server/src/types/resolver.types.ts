// Describes input data for creating or updating a question.
export interface QuestionInput {
    id?: string;
    title: string;
    type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
    options?: string[];
    required?: boolean;
}

// Describes arguments for creating a form.
export interface CreateFormArgs {
    title: string;
    description?: string;
    questions?: QuestionInput[];
}

// Describes arguments for updating a form.
export interface UpdateFormArgs {
    id: string;
    title: string;
    description?: string;
    questions?: QuestionInput[];
}

// Describes arguments for submitting a form response.
export interface SubmitResponseArgs {
    formId: string;
    answers: AnswerInput[];
}

// Describes input data for one answer in a submitted response.
export interface AnswerInput {
    questionId: string;
    value: string | string[];
}