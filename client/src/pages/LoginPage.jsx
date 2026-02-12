

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const LoginPage = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [form, setForm] = useState({
        email: 'ketan@test.com',
        password: 'Admin@123',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form.email, form.password);
            navigate(from, { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
        }
    };

    // Login form --> authApi --> update AuthContext

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-title">Tenant Management</div>
                <div className="login-subtitle">Sign in with your admin credentials</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label className="form-label" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="form-input"
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label className="form-label" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="form-input"
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <div className="error-text">{error}</div>}
                    <button className="button" type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
