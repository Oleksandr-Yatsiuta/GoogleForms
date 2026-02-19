import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import FormFillPage from './FormFillPage';

// ---------------- MOCK STATE ----------------
const mockNavigate = vi.fn();
const mockSubmit = vi.fn();

// Це буде керований mock для getForm
const mockUseGetFormQuery = vi.fn();

// ---------------- MOCK MODULES ----------------
vi.mock('../../services/api', () => ({
    useGetFormQuery: (...args: any[]) => mockUseGetFormQuery(...args),
    useSubmitResponseMutation: () => [mockSubmit, { isLoading: false }],
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ---------------- MOCK DATA ----------------
const mockForm = {
    id: 'form-1',
    title: 'Test Form',
    description: 'Test description',
    questions: [
        { id: 'q1', title: 'Name', type: 'TEXT', required: true, options: [] },
        { id: 'q2', title: 'Gender', type: 'MULTIPLE_CHOICE', required: false, options: ['Male', 'Female'] },
        { id: 'q3', title: 'Skills', type: 'CHECKBOX', required: false, options: ['JS', 'TS'] },
    ],
};

// ---------------- CLEANUP ----------------
afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

// ---------------- HELPER ----------------
const renderPage = () =>
    render(
        <MemoryRouter initialEntries={['/fill/form-1']}>
            <Routes>
                <Route path="/fill/:formId" element={<FormFillPage />} />
            </Routes>
        </MemoryRouter>
    );

// ================= TESTS =================
describe('FormFillPage (MUST HAVE)', () => {

    beforeEach(() => {
        mockUseGetFormQuery.mockReturnValue({
            data: mockForm,
            isLoading: false,
            error: undefined,
        });
    });

    // Loading
    it('shows loading state', () => {
        mockUseGetFormQuery.mockReturnValueOnce({
            data: undefined,
            isLoading: true,
            error: undefined,
        });

        renderPage();
        expect(screen.getByText(/loading/i)).toBeTruthy();
    });

    // Render
    it('renders form', () => {
        renderPage();
        expect(screen.getByText('Test Form')).toBeTruthy();
        expect(screen.getByText('Name')).toBeTruthy();
    });

    // Text input
    it('updates text input', () => {
        renderPage();

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'John' } });

        expect((input as HTMLInputElement).value).toBe('John');
    });

    // Radio
    it('selects radio option', () => {
        renderPage();

        const radio = screen.getByDisplayValue('Male') as HTMLInputElement;
        fireEvent.click(radio);

        expect(radio.checked).toBe(true);
    });

    // Checkbox
    it('selects checkbox option', () => {
        renderPage();

        const checkbox = screen.getByDisplayValue('JS') as HTMLInputElement;
        fireEvent.click(checkbox);

        expect(checkbox.checked).toBe(true);
    });

    // Submit
    it('submits form', async () => {
        renderPage();

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'John' } });
        fireEvent.click(screen.getByDisplayValue('Male'));

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        expect(mockSubmit).toHaveBeenCalled();
    });
});
