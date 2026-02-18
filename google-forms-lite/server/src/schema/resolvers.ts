import { store, Question, Answer as StoreAnswer } from '../data/store';

export const resolvers = {
  Query: {
    forms: () => {
      return store.getForms();
    },
    form: ({ id }: { id: string }) => {
      return store.getForm(id);
    },
    responses: ({ formId }: { formId: string }) => {
      return store.getResponses(formId);
    },
  },

  Mutation: {
    createForm: ({ title, description, questions }: { title: string; description?: string; questions?: any[] }) => {
      const safeTitle =
        typeof title === 'string' && title.trim().length > 0 ? title : 'Untitled Form';

      const formQuestions: Question[] = (questions || []).map((q: any) => ({
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

    submitResponse: ({ formId, answers }: { formId: string; answers: any[] }) => {
      const storeAnswers: StoreAnswer[] = answers.map((a: any) => ({
        questionId: a.questionId,
        value: Array.isArray(a.value) ? a.value : [a.value],
      }));

      return store.submitResponse(formId, storeAnswers);
    },
  },

  Form: {
    createdAt: (form: any) => form.createdAt,
  },

  Response: {
    submittedAt: (response: any) => response.submittedAt,
  },
};