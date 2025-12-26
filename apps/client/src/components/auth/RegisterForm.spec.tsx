import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from './RegisterForm';
import { BrowserRouter } from 'react-router-dom';
import { api } from '../../lib/api';
import { vi } from 'vitest';

vi.mock('../../lib/api');
const mockApiPost = api.post as any;

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <RegisterForm />
        </BrowserRouter>
    );
};

describe('RegisterForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // AUTH-029: Render Register Form
    it('renders register form explicitly', () => {
        renderComponent();
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

        // Exact match for Password vs Confirm Password
        expect(screen.getByLabelText(/^Password$/)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Confirm Password$/)).toBeInTheDocument();
    });

    // AUTH-030: Passwords Mismatch
    it('shows error when passwords do not match', async () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText(/^Password$/), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText(/^Confirm Password$/), { target: { value: 'Mismatch123' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    // AUTH-031: Weak Password
    it('shows error for weak password', async () => {
        renderComponent();
        fireEvent.change(screen.getByLabelText(/^Password$/), { target: { value: 'weak' } });
        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
    });

    // AUTH-032: Successful Registration
    it('submits form on valid data', async () => {
        mockApiPost.mockResolvedValue({ data: { access_token: 'valid-token' } });
        renderComponent();

        fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText(/^Password$/), { target: { value: 'Password123' } });
        fireEvent.change(screen.getByLabelText(/^Confirm Password$/), { target: { value: 'Password123' } });

        fireEvent.click(screen.getByRole('button', { name: /create account/i }));

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/auth/register', {
                fullName: 'Test User',
                email: 'new@example.com',
                password: 'Password123',
                role: 'Customer' // Default
            });
        });
    });
});
