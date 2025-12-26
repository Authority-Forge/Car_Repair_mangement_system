import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
    allowedRoles?: string[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
    const token = localStorage.getItem('token');

    // In a real app, we decode the token to check role or fetch 'me' endpoint
    // For MVP, we'll crudely decode or assume basic role check if needed, 
    // BUT since we don't have a robust AuthProvider decoding context yet,
    // we will check token existence.
    // If strict role check is needed per spec:
    // We should parse the JWT (payload base64) to get the role.

    let userRole = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userRole = payload.role;
        } catch (e) {
            // Invalid token
        }
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />; // Or redirect to home
    }

    return <Outlet />;
}
