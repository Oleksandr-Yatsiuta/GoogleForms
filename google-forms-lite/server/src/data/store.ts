import type { Form, Question, Response, Answer } from '../../../types/form.types';

// In-memory store for forms and responses.
class Store {
  private forms: Map<string, Form> = new Map();
  private responses: Map<string, Response[]> = new Map();
  private formIdCounter = 1;
  private responseIdCounter = 1;
  private questionIdCounter = 1;

  // Creates a new form.
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

  // Updates an existing form by ID.
  updateForm(id: string, title: string, description?: string, questions: Question[] = []): Form | null {
    const existingForm = this.forms.get(id);
    if (!existingForm) return null;

    const updatedForm: Form = {
      ...existingForm,
      title,
      description,
      questions: questions.map((q) => ({
        ...q,
        id: q.id || `question-${this.questionIdCounter++}`,
      })),
    };
    this.forms.set(id, updatedForm);
    return updatedForm;
  }

  // Returns all forms.
  getForms(): Form[] {
    return Array.from(this.forms.values());
  }

  // Returns one form by ID.
  getForm(id: string): Form | undefined {
    return this.forms.get(id);
  }

  // Saves a response for a form.
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

  // Returns all responses for a form.
  getResponses(formId: string): Response[] {
    return this.responses.get(formId) || [];
  }
}

export const store = new Store();