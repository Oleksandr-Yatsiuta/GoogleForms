import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import FormBuilderPage from './FormBuilderPage';

// Mock RTK Query hooks to prevent actual API calls
vi.mock('../../services/api', () => ({
    useGetFormQuery: vi.fn(() => ({ data: null, isLoading: false })),
    useCreateFormMutation: vi.fn(() => [vi.fn()]),
    useUpdateFormMutation: vi.fn(() => [vi.fn()]),
}));

// Cleanup after each test to reset DOM and mocks
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

describe('FormBuilderPage (MUST HAVE)', () => {


    // Helper to render page with router
    const renderPage = () =>
        render(
            <MemoryRouter initialEntries={['/forms/new']}>
                <FormBuilderPage />
            </MemoryRouter>
        );

    // Smoke test
    it('renders without crashing', () => {
        renderPage();
        expect(screen.getByPlaceholderText('Untitled Form')).toBeTruthy();
    });

    // Core form editing
    it('changes form title when user types', () => {
        renderPage();

        const titleInput = screen.getByPlaceholderText('Untitled Form') as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'My New Form' } });

        expect(titleInput.value).toBe('My New Form');
    });

    // Core builder behavior
    it('adds a new question when Add Question button is clicked', () => {
        renderPage();

        const initial = screen.getAllByPlaceholderText('Question text').length;
        fireEvent.click(screen.getByText('+ Add Question'));
        const updated = screen.getAllByPlaceholderText('Question text').length;

        expect(updated).toBe(initial + 1);
    });

    // Remove question
    it('deletes question when delete button is clicked', () => {
        renderPage();

        fireEvent.click(screen.getByText('+ Add Question'));

        const initial = screen.getAllByPlaceholderText('Question text').length;
        fireEvent.click(screen.getAllByTitle('Delete question')[0]);
        const updated = screen.getAllByPlaceholderText('Question text').length;

        expect(updated).toBe(initial - 1);
    });

    // Edge case protection
    it('does not delete the last question', () => {
        renderPage();

        fireEvent.click(screen.getAllByTitle('Delete question')[0]);

        const questions = screen.getAllByPlaceholderText('Question text');
        expect(questions.length).toBe(1);
    });


});
