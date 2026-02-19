import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from './api';

const shouldSkipGetFormQuery = (formId: string | null | undefined): boolean =>
  !formId || formId === 'new';

describe('API service', () => {
  it('should expose main endpoints', () => {
    expect(api.endpoints.getForms).toBeDefined();
    expect(api.endpoints.getForm).toBeDefined();
    expect(api.endpoints.createForm).toBeDefined();
    expect(api.endpoints.updateForm).toBeDefined();
  });

  it('should initialize reducer', () => {
    const state = api.reducer(undefined, { type: '@@INIT' });
    expect(state).toHaveProperty('queries');
  });

  describe('skip logic', () => {
    it('should skip invalid ids', () => {
      expect(shouldSkipGetFormQuery('')).toBe(true);
      expect(shouldSkipGetFormQuery('new')).toBe(true);
    });

    it('should allow valid id', () => {
      expect(shouldSkipGetFormQuery('123')).toBe(false);
    });
  });
});
