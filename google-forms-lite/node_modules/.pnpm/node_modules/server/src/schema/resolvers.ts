import { store, Question, Answer as StoreAnswer } from '../data/store';

export const resolvers = {
  Query: {
    forms: () => {
      return store.getForms();
    },
    form: (_: any, { id }: { id: string }) => {
      return store.getForm(id);
    },
    responses: (_: any, { formId }: { formId: string }) => {
      return store.getResponses(formId);
    },
  },

  Mutation: {
    createForm: (
      _: any,
      {
        title,
        description,
        questions,
      }: {
        title: string;
        description?: string;
        questions?: any[];
      }
    ) => {
      const formQuestions: Question[] = (questions || []).map((q: any) => ({
        id: `q-${Math.random().toString(36).substr(2, 9)}`,
        text: q.text,
        type: q.type,
        options: q.options || [],
        required: q.required !== false,
      }));

      return store.createForm(title, description, formQuestions);
    },

    submitResponse: (
      _: any,
      { formId, answers }: { formId: string; answers: any[] }
    ) => {
      const storeAnswers: StoreAnswer[] = answers.map((a: any) => ({
        questionId: a.questionId,
        value: Array.isArray(a.value) ? a.value : [a.value],
      }));

      return store.submitResponse(formId, storeAnswers);
    },
  },

  Form: {
    createdAt: (form: any) => form.createdAt.toISOString(),
  },

  Response: {
    submittedAt: (response: any) => response.submittedAt.toISOString(),
  },
};