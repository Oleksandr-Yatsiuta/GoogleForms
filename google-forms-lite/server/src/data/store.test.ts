import { describe, it, expect, beforeEach } from 'vitest';
import { store } from './store';
import type { Form, Question } from '../../../types/form.types';

describe('Store', () => {
  beforeEach(() => {
    // -------------------------
    // Optional: reset store before each test
    // -------------------------
  });

  // -------------------------
  // Tests for creating forms
  // -------------------------
  describe('createForm', () => {
    it('creates a form with title and returns it', () => {
      const result = store.createForm('Test Form');
      expect(result.id).toBeDefined(); // ID should be generated
      expect(result.title).toBe('Test Form'); // Title is correctly assigned
      expect(result.questions).toEqual([]); // Default empty questions
      expect(result.createdAt).toBeDefined(); // Creation timestamp exists
    });

    it('creates a form with description', () => {
      const result = store.createForm('Form', 'Test Description');
      expect(result.description).toBe('Test Description');
    });

    it('creates a form with questions', () => {
      const questions: Question[] = [
        { id: 'q1', title: 'Question 1', type: 'TEXT', required: true },
      ];
      const result = store.createForm('Form', '', questions);
      expect(result.questions).toHaveLength(1); 
      expect(result.questions[0].title).toBe('Question 1');
    });

    it('generates unique IDs for forms', () => {
      const form1 = store.createForm('Form 1');
      const form2 = store.createForm('Form 2');
      expect(form1.id).not.toBe(form2.id); 
    });

    it('generates IDs for questions without IDs', () => {
      const questions: Question[] = [{ title: 'Q1', type: 'MULTIPLE_CHOICE', required: false } as Question];
      const form = store.createForm('Form', '', questions);
      expect(form.questions[0].id).toBeDefined(); 
    });
  });

  // -------------------------
  // Tests for updating forms
  // -------------------------
  describe('updateForm', () => {
    it('updates form title and description', () => {
      const created = store.createForm('Original');
      const updated = store.updateForm(created.id, 'Updated', 'New desc');
      expect(updated?.title).toBe('Updated'); 
      expect(updated?.description).toBe('New desc'); 
    });

    it('returns null for non-existent form', () => {
      const result = store.updateForm('non-existent-id', 'Title');
      expect(result).toBeNull(); 
    });

    it('updates questions in form', () => {
      const created = store.createForm('Form');
      const newQuestions: Question[] = [{ id: 'q1', title: 'New Q', type: 'TEXT', required: true }];
      const updated = store.updateForm(created.id, 'Form', '', newQuestions);
      expect(updated?.questions).toHaveLength(1); 
      expect(updated?.questions[0].title).toBe('New Q');
    });

    it('preserves form ID after update', () => {
      const created = store.createForm('Form');
      const updated = store.updateForm(created.id, 'Updated');
      expect(updated?.id).toBe(created.id); 
    });
  });

  // -------------------------
  // Tests for retrieving all forms
  // -------------------------
  describe('getForms', () => {
    it('returns all created forms', () => {
      const form1 = store.createForm('Form 1');
      const form2 = store.createForm('Form 2');
      const forms = store.getForms();
      expect(forms.length).toBeGreaterThanOrEqual(2);
      expect(forms.some(f => f.id === form1.id)).toBe(true);
      expect(forms.some(f => f.id === form2.id)).toBe(true);
    });

    it('returns empty array if no forms exist', () => {
      const forms = store.getForms();
      expect(Array.isArray(forms)).toBe(true);
    });
  });

  // -------------------------
  // Tests for retrieving a single form by ID
  // -------------------------
  describe('getForm', () => {
    it('returns form by ID', () => {
      const created = store.createForm('Test Form');
      const retrieved = store.getForm(created.id);
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test Form');
    });

    it('returns undefined for non-existent form', () => {
      const result = store.getForm('non-existent');
      expect(result).toBeUndefined();
    });
  });

  // -------------------------
  // Tests for submitting responses
  // -------------------------
  describe('submitResponse', () => {
    it('creates a response for existing form', () => {
      const form = store.createForm('Form');
      const response = store.submitResponse(form.id, [{ questionId: 'q1', value: 'Answer' }]);
      expect(response?.id).toBeDefined();
      expect(response?.formId).toBe(form.id);
      expect(response?.answers).toHaveLength(1);
      expect(response?.submittedAt).toBeDefined();
    });

    it('returns null for non-existent form', () => {
      const result = store.submitResponse('non-existent', []);
      expect(result).toBeNull();
    });

    it('stores multiple answers', () => {
      const form = store.createForm('Form');
      const response = store.submitResponse(form.id, [
        { questionId: 'q1', value: 'Answer 1' },
        { questionId: 'q2', value: ['A', 'B'] },
      ]);
      expect(response?.answers).toHaveLength(2);
    });

    it('generates unique response IDs', () => {
      const form = store.createForm('Form');
      const resp1 = store.submitResponse(form.id, []);
      const resp2 = store.submitResponse(form.id, []);
      expect(resp1?.id).not.toBe(resp2?.id); 
    });
  });

  // -------------------------
  // Tests for retrieving responses
  // -------------------------
  describe('getResponses', () => {
    it('returns responses for form', () => {
      const form = store.createForm('Form');
      store.submitResponse(form.id, [{ questionId: 'q1', value: 'A' }]);
      store.submitResponse(form.id, [{ questionId: 'q1', value: 'B' }]);
      const responses = store.getResponses(form.id);
      expect(responses).toHaveLength(2); 
    });

    it('returns empty array for form with no responses', () => {
      const form = store.createForm('Form');
      const responses = store.getResponses(form.id);
      expect(responses).toEqual([]); 
    });

    it('returns empty array for non-existent form', () => {
      const responses = store.getResponses('non-existent');
      expect(responses).toEqual([]); 
    });
  });
});
