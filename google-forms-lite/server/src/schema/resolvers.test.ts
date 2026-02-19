import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolvers } from './resolvers';
import { FormService } from '../services/formService';
import { ResponseService } from '../services/responseService';
import type { Form, Response } from '../../../types/form.types';

describe('GraphQL Resolvers', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -----------------------------
  // Query Resolvers
  // -----------------------------
  describe('Query.forms', () => {
    it('returns all forms from FormService', () => {
      const mockForms: Form[] = [
        { id: 'form-1', title: 'Form 1', description: 'Desc', questions: [], createdAt: '2024-01-01' },
      ];
      
      vi.spyOn(FormService, 'getAllForms').mockReturnValue(mockForms);
      
      const result = resolvers.Query.forms();
      
      expect(result).toEqual(mockForms);
      expect(FormService.getAllForms).toHaveBeenCalled();
    });
  });

  describe('Query.form', () => {
    it('returns form by ID from FormService', () => {
      const mockForm: Form = { id: 'form-1', title: 'Form-1', description: "top form", questions: [], createdAt: '2024-01-01' };
      vi.spyOn(FormService, 'getForm').mockReturnValue(mockForm);
      
      const result = resolvers.Query.form({ id: "form-1" });
      
      expect(result).toEqual(mockForm);
      expect(FormService.getForm).toHaveBeenCalledWith("form-1");
    });
  });

  describe('Query.responses', () => {
    it('returns responses for a form from ResponseService', () => {
      const mockResponses: Response[] = [{ id: 'resp-1', formId: 'form-1', answers: [], submittedAt: '2024-01-01' }];
      vi.spyOn(ResponseService, 'getResponses').mockReturnValue(mockResponses);
      
      const result = resolvers.Query.responses({ formId: 'form-1' });
      
      expect(result).toEqual(mockResponses);
      expect(ResponseService.getResponses).toHaveBeenCalledWith('form-1');
    });
  });

  // -----------------------------
  // Mutation Resolvers
  // -----------------------------
  describe('Mutation.createForm', () => {
    it('creates form with title', () => {
      const mockForm: Form = { id: 'form-1', title: 'New Form', questions: [], createdAt: '2024-01-01' };
      vi.spyOn(FormService, 'createForm').mockReturnValue(mockForm);
      
      const result = resolvers.Mutation.createForm({ title: 'New Form' } as any);
      
      expect(result.title).toBe('New Form');
      expect(FormService.createForm).toHaveBeenCalledWith('New Form', undefined, undefined);
    });

    it('creates form with description and questions', () => {
      const mockForm: Form = { id: 'form-1', title: 'Form', description: 'Desc', questions: [], createdAt: '2024-01-01' };
      vi.spyOn(FormService, 'createForm').mockReturnValue(mockForm);
      
      const result = resolvers.Mutation.createForm({ title: 'Form', description: 'Desc', questions: [] } as any);
      
      expect(result.description).toBe('Desc');
      expect(FormService.createForm).toHaveBeenCalledWith('Form', 'Desc', []);
    });
  });

  describe('Mutation.updateForm', () => {
    it('updates existing form', () => {
      const mockForm: Form = { id: 'form-1', title: 'Updated', questions: [], createdAt: '2024-01-01' };
      vi.spyOn(FormService, 'updateForm').mockReturnValue(mockForm);
      
      const result = resolvers.Mutation.updateForm({ id: 'form-1', title: 'Updated' } as any);
      
      expect(result?.title).toBe('Updated');
      expect(FormService.updateForm).toHaveBeenCalledWith('form-1', 'Updated', undefined, undefined);
    });

    it('returns null if form not found', () => {
      vi.spyOn(FormService, 'updateForm').mockReturnValue(null);
      
      const result = resolvers.Mutation.updateForm({ id: 'non-existent', title: 'Title' } as any);
      
      expect(result).toBeNull();
    });
  });

  describe('Mutation.submitResponse', () => {
    it('submits a response for a form', () => {
      const mockResponse: Response = { id: 'resp-1', formId: 'form-1', answers: [{ questionId: 'q1', value: 'Answer' }], submittedAt: '2024-01-01' };
      vi.spyOn(ResponseService, 'submitResponse').mockReturnValue(mockResponse);
      
      const result = resolvers.Mutation.submitResponse({ formId: 'form-1', answers: [{ questionId: 'q1', value: 'Answer' }] } as any);
      
      expect(result?.id).toBe('resp-1');
      expect(ResponseService.submitResponse).toHaveBeenCalledWith('form-1', [{ questionId: 'q1', value: 'Answer' }]);
    });

    it('returns null if form not found', () => {
      vi.spyOn(ResponseService, 'submitResponse').mockReturnValue(null);
      
      const result = resolvers.Mutation.submitResponse({ formId: 'non-existent', answers: [] } as any);
      
      expect(result).toBeNull();
    });
  });

  // -----------------------------
  // Field Resolvers
  // -----------------------------
  describe('Form field resolver', () => {
    it('resolves createdAt field correctly', () => {
      const mockForm: Form = { id: 'form-1', title: 'Form', questions: [], createdAt: '2024-01-01T00:00:00Z' };
      const result = resolvers.Form.createdAt(mockForm);
      
      expect(result).toBe('2024-01-01T00:00:00Z');
    });
  });

  describe('Response field resolver', () => {
    it('resolves submittedAt field correctly', () => {
      const mockResponse: Response = { id: 'resp-1', formId: 'form-1', answers: [], submittedAt: '2024-01-01T00:00:00Z' };
      const result = resolvers.Response.submittedAt(mockResponse);
      
      expect(result).toBe('2024-01-01T00:00:00Z');
    });
  });
});
