import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';


describe('PrivateRoute', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    const renderWithRouter = (initialEntry: string, allowedRoles?: string[]) => {
        return render(
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route element={<PrivateRoute allowedRoles={allowedRoles} />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    };

    // AUTH-049: Redirects to login if no token
    it('redirects to login when unauthenticated', () => {
        renderWithRouter('/protected');
        expect(screen.getByText('Login Page')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    // AUTH-050: Allows access with valid token
    it('allows access when authenticated', () => {
        // Mock a token (header.payload.signature)
        // payload: {"role": "Mechanic"} -> base64 'eyJyb2xlIjoiTWVjaGFuaWMifQ=='
        const mockToken = 'header.eyJyb2xlIjoiTWVjaGFuaWMifQ==.sig';
        localStorage.setItem('token', mockToken);

        renderWithRouter('/protected');
        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    // AUTH-051: Role Restriction
    it('redirects/blocks when role does not match', () => {
        const mockToken = 'header.eyJyb2xlIjoiQ3VzdG9tZXIifQ==.sig'; // Role: Customer
        localStorage.setItem('token', mockToken);

        // Expect to not see content if allowedRole is Mechanic
        // Since we didn't implement 'Unauth Page' routing in test setup, it might render nothing (Outlet empty)
        // or Navigate away. In our impl: <Navigate to="/unauthorized" />

        // Let's add unauth route to test setup
        const { getByText, queryByText } = render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/unauthorized" element={<div>Unauthorized</div>} />
                    <Route element={<PrivateRoute allowedRoles={['Mechanic']} />}>
                        <Route path="/protected" element={<div>Protected Content</div>} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(queryByText('Protected Content')).not.toBeInTheDocument();
        // Should redirect to unauthorized
        expect(getByText('Unauthorized')).toBeInTheDocument();
    });
});
