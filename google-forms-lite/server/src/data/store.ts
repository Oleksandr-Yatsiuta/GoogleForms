export interface Answer {
  questionId: string;
  value: string | string[];
}

export interface Response {
  id: string;
  formId: string;
  answers: Answer[];
  submittedAt: string;
}

export interface Question {
  id: string;
  title: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
  options?: string[];
  required: boolean;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
}

class Store {
  private forms: Map<string, Form> = new Map();
  private responses: Map<string, Response[]> = new Map();
  private formIdCounter = 1;
  private responseIdCounter = 1;
  private questionIdCounter = 1;

  createForm(title: string, description?: string, questions: Question[] = []): Form {
    const id = `form-${this.formIdCounter++}`;
    const form: Form = {
      id,
      title,
      description,
      questions: questions.map((q) => ({
        ...q,
        id: q.id || `question-${this.questionIdCounter++}`,
      })),
      createdAt: new Date().toISOString(),
    };
    this.forms.set(id, form);
    this.responses.set(id, []);
    return form;
  }

  getForms(): Form[] {
    return Array.from(this.forms.values());
  }

  getForm(id: string): Form | undefined {
    return this.forms.get(id);
  }

  submitResponse(formId: string, answers: Answer[]): Response | null {
    if (!this.forms.has(formId)) return null;

    const id = `response-${this.responseIdCounter++}`;
    const response: Response = {
      id,
      formId,
      answers,
      submittedAt: new Date().toISOString(),
    };

    const formResponses = this.responses.get(formId) || [];
    formResponses.push(response);
    this.responses.set(formId, formResponses);

    return response;
  }

  getResponses(formId: string): Response[] {
    return this.responses.get(formId) || [];
  }
}

export const store = new Store();