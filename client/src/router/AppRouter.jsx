import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// components
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import Layout from '../components/layout/Layout.jsx';

// Pages
import LoginPage from '../pages/LoginPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import UsersPage from '../pages/UsersPage.jsx';
import RolesPage from '../pages/RolesPage.jsx';
import SitesPage from '../pages/SitesPage.jsx';



const AppRouter = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={


                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="sites" element={<SitesPage />} />

            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
