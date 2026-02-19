import { FormService } from '../services/formService';
import { ResponseService } from '../services/responseService';
import { Form, Response } from '../types/form.types';
import { CreateFormArgs, UpdateFormArgs, SubmitResponseArgs } from '../types/resolver.types';

// Defines GraphQL resolvers for queries, mutations, and field mappings.
export const resolvers = {
  // Handles read operations.
  Query: {
    forms: (): Form[] => {
      return FormService.getAllForms();
    },
    form: ({ id }: { id: string }): Form | undefined => {
      return FormService.getForm(id);
    },
    responses: ({ formId }: { formId: string }): Response[] => {
      return ResponseService.getResponses(formId);
    },
  },

  // Handles write operations.
  Mutation: {
    createForm: ({ title, description, questions }: CreateFormArgs): Form => {
      return FormService.createForm(title, description, questions);
    },

    updateForm: ({ id, title, description, questions }: UpdateFormArgs): Form | null => {
      return FormService.updateForm(id, title, description, questions);
    },

    submitResponse: ({ formId, answers }: SubmitResponseArgs): Response | null => {
      return ResponseService.submitResponse(formId, answers);
    },
  },

  // Resolves fields for the Form type.
  Form: {
    createdAt: (form: Form): string => form.createdAt,
  },

  // Resolves fields for the Response type.
  Response: {
    submittedAt: (response: Response): string => response.submittedAt,
  },
};