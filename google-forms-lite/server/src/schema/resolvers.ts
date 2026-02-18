import { store, Question, Answer as StoreAnswer, Form, Response } from '../data/store';

interface CreateFormArgs {
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

interface UpdateFormArgs {
  id: string;
  title: string;
  description?: string;
  questions?: QuestionInput[];
}

interface QuestionInput {
  title: string;
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE';
  options?: string[];
  required?: boolean;
}

interface SubmitResponseArgs {
  formId: string;
  answers: AnswerInput[];
}

interface AnswerInput {
  questionId: string;
  value: string | string[];
}

export const resolvers = {
  Query: {
    forms: (): Form[] => {
      return store.getForms();
    },
    form: ({ id }: { id: string }): Form | undefined => {
      return store.getForm(id);
    },
    responses: ({ formId }: { formId: string }): Response[] => {
      return store.getResponses(formId);
    },
  },

  Mutation: {
    createForm: ({ title, description, questions }: CreateFormArgs): Form => {
      const safeTitle =
        typeof title === 'string' && title.trim().length > 0 ? title : 'Untitled Form';

      const formQuestions: Question[] = (questions || []).map((q) => ({
        id: `q-${Math.random().toString(36).substr(2, 9)}`,
        title:
          typeof q.title === 'string' && q.title.trim().length > 0
            ? q.title
            : 'Untitled Question',
        type: q.type,
        options: Array.isArray(q.options) ? q.options : [],
        required: q.required === true,
      }));

      return store.createForm(safeTitle, description, formQuestions);
    },

    updateForm: ({ id, title, description, questions }: UpdateFormArgs): Form | null => {
      const safeTitle =
        typeof title === 'string' && title.trim().length > 0 ? title : 'Untitled Form';

      const formQuestions: Question[] = (questions || []).map((q) => ({
        id: `q-${Math.random().toString(36).substr(2, 9)}`,
        title:
          typeof q.title === 'string' && q.title.trim().length > 0
            ? q.title
            : 'Untitled Question',
        type: q.type,
        options: Array.isArray(q.options) ? q.options : [],
        required: q.required === true,
      }));

      return store.updateForm(id, safeTitle, description, formQuestions);
    },

    submitResponse: ({ formId, answers }: SubmitResponseArgs): Response | null => {
      const storeAnswers: StoreAnswer[] = answers.map((a) => ({
        questionId: a.questionId,
        value: Array.isArray(a.value) ? a.value : [a.value],
      }));

      return store.submitResponse(formId, storeAnswers);
    },
  },

  Form: {
    createdAt: (form: Form): string => form.createdAt,
  },

  Response: {
    submittedAt: (response: Response): string => response.submittedAt,
  },
};