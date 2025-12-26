import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/mechanic/DashboardPage';
import { JobDetailsPage } from './pages/mechanic/JobDetailsPage';
import { CustomerLayout } from './layouts/CustomerLayout';
import { CustomerPortalPage } from './pages/customer/CustomerPortalPage';

function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Mechanic Routes */}
                <Route element={<PrivateRoute allowedRoles={['Mechanic', 'Admin']} />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/job/:id" element={<JobDetailsPage />} />
                        <Route path="/jobs" element={<DashboardPage />} />
                    </Route>
                </Route>

                {/* Protected Customer Routes */}
                <Route element={<PrivateRoute allowedRoles={['Customer', 'Admin']} />}>
                    <Route element={<CustomerLayout />}>
                        <Route path="/portal" element={<CustomerPortalPage />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
