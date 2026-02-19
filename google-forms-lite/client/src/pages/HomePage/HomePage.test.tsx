import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, afterEach, vi, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

// -----------------------------
// Mock API hook to control server data inside test
// -----------------------------
vi.mock('../../services/api', () => ({
  useGetFormsQuery: vi.fn(),
}));

// -----------------------------
// Mock SearchForms component to isolate HomePage behavior
// (avoids testing child component here)
// -----------------------------
vi.mock('../../components/SearchForms/SearchForms', () => ({
  default: () => <div>SearchForms</div>,
}));

import { useGetFormsQuery } from '../../services/api';

// -----------------------------
// Cleanup after each test
// - unmount React tree
// - clear mocks to avoid test pollution
// -----------------------------
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('HomePage', () => {
  it('renders fetched forms and links to create/edit/fill', () => {
    // -----------------------------
    // Arrange
    // Mock API response with one form
    // -----------------------------
    vi.mocked(useGetFormsQuery).mockReturnValue({
      data: [
        { id: 'form-1', title: 'Customer Survey', description: 'desc' },
      ],
      isLoading: false,
    } as unknown as ReturnType<typeof useGetFormsQuery>);

    // -----------------------------
    // Act
    // Render page inside router (required for <Link>)
    // -----------------------------
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    // -----------------------------
    // Assert
    // 1. Page shows CTA to create form
    // 2. Fetched form title is rendered
    // 3. Links for create/edit/fill exist and have correct routes
    // -----------------------------
    expect(screen.getByText('Make a new form')).toBeTruthy();
    expect(screen.getAllByText('Customer Survey').length).toBeGreaterThan(0);

    expect(
      screen.getByRole('link', { name: 'Create Form' }).getAttribute('href')
    ).toBe('/forms/new');

    expect(
      screen.getAllByRole('link').some(
        (link) => link.getAttribute('href') === '/forms/form-1/edit'
      )
    ).toBe(true);

    expect(
      screen.getAllByRole('link').some(
        (link) => link.getAttribute('href') === '/forms/form-1/fill'
      )
    ).toBe(true);
  });
});
