import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, afterEach, vi, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResponsesPage from './ResponsesPage';
import type { FormQuestion } from '../../../../types/form.types';

// -------------------------
// Mock RTK Query hooks
// -------------------------
vi.mock('../../services/api', () => ({
    useGetFormQuery: vi.fn(),
    useGetResponsesQuery: vi.fn(),
}));

import { useGetFormQuery, useGetResponsesQuery } from '../../services/api';

// -------------------------
// Cleanup after each test
// -------------------------
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('ResponsesPage (must-have tests)', () => {
    // -------------------------
    // Mock form and responses
    // -------------------------
    const mockForm = {
        id: 'form-1',
        title: 'Test Form',
        description: 'Form Desc',
        questions: [
            { id: 'q1', title: 'Question 1', type: 'TEXT', required: true, options: [] } as FormQuestion,
        ],
    };

    const mockResponses = [
        {
            id: 'r1',
            formId: 'form-1',
            submittedAt: '2026-02-19T12:00:00Z',
            answers: [{ questionId: 'q1', value: 'Answer 1' }],
        },
    ];

    // -------------------------
    // Helper function to render page with router
    // -------------------------
    const renderPage = (formId = 'form-1') =>
        render(
            <MemoryRouter initialEntries={[`/forms/${formId}/responses`]}>
                <Routes>
                    <Route path="/forms/:formId/responses" element={<ResponsesPage />} />
                </Routes>
            </MemoryRouter>
        );

    // -------------------------
    // Test loading state
    // -------------------------
    it('renders loading state', () => {
        (useGetFormQuery as any).mockReturnValue({ data: null, isLoading: true });
        (useGetResponsesQuery as any).mockReturnValue({ data: [], isLoading: true });

        renderPage();
        expect(screen.getByText(/Loading responses.../i)).toBeTruthy();
    });

    // -------------------------
    // Test error state
    // -------------------------
    it('renders error state', () => {
        (useGetFormQuery as any).mockReturnValue({ data: null, isLoading: false, isError: true });
        (useGetResponsesQuery as any).mockReturnValue({ data: [], isLoading: false, isError: true });

        renderPage();
        expect(screen.getByText(/Failed to load form or responses/i)).toBeTruthy();
    });

    // -------------------------
    // Test empty state (no responses)
    // -------------------------
    it('renders empty state if no responses', () => {
        (useGetFormQuery as any).mockReturnValue({ data: mockForm, isLoading: false });
        (useGetResponsesQuery as any).mockReturnValue({ data: [], isLoading: false });

        renderPage();
        expect(screen.getByText(/No responses yet/i)).toBeTruthy();
    });

    // -------------------------
    // Test rendering a response
    // -------------------------
    it('renders a response', () => {
        (useGetFormQuery as any).mockReturnValue({ data: mockForm, isLoading: false });
        (useGetResponsesQuery as any).mockReturnValue({ data: mockResponses, isLoading: false });

        renderPage();
        expect(screen.getByText(/Test Form/i)).toBeTruthy();
        expect(screen.getByText(/Response #1/i)).toBeTruthy();
        expect(screen.getByText(/Question 1/i)).toBeTruthy();
        expect(screen.getByText(/Answer 1/i)).toBeTruthy();
    });

    // -------------------------
    // Test pagination buttons
    // -------------------------
    it('pagination buttons work correctly', () => {
        const responses = [
            ...mockResponses,
            {
                id: 'r2',
                formId: 'form-1',
                submittedAt: '2026-02-19T13:00:00Z',
                answers: [{ questionId: 'q1', value: 'Answer 2' }],
            },
        ];

        vi.mocked(useGetFormQuery).mockReturnValue({ data: mockForm, isLoading: false } as any);
        vi.mocked(useGetResponsesQuery).mockReturnValue({ data: responses, isLoading: false } as any);

        renderPage();
        const nextBtn = screen.getByText('→') as HTMLButtonElement;
        const prevBtn = screen.getByText('←') as HTMLButtonElement;

        // Initial state: prev disabled, next enabled
        expect(prevBtn.disabled).toBe(true);
        expect(nextBtn.disabled).toBe(false);

        // Click next page
        fireEvent.click(nextBtn);
        expect(prevBtn.disabled).toBe(false);
    });
});
