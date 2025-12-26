import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from './LoginForm';
import { BrowserRouter } from 'react-router-dom';
import { api } from '@/lib/api';
import { vi } from 'vitest';

// Mock API and Navigation
vi.mock('@/lib/api');
const mockApiPost = api.post as any;

const renderComponent = () => {
    return render(
        <BrowserRouter>
            <LoginForm />
        </BrowserRouter>
    );
};

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // AUTH-009: Render Login Form
    it('renders login form elements', () => {
        renderComponent();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    // AUTH-010: Client-side Validation - Invalid Email
    it('shows validation error for invalid email', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });
        expect(mockApiPost).not.toHaveBeenCalled();
    });

    // AUTH-011: Client-side Validation - Short Password
    it('shows validation error for short password', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
        });
        expect(mockApiPost).not.toHaveBeenCalled();
    });

    // AUTH-012: Successful Login Call
    it('calls login api on valid input', async () => {
        mockApiPost.mockResolvedValue({ data: { access_token: 'fake-token' } });
        renderComponent();

        fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockApiPost).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
                role: 'Mechanic' // Default role
            });
        });
    });
});
