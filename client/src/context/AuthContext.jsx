import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import authApi from '../api/auth.api.js';

export const AuthContext = createContext({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => { },
  logout: () => { },
  hasPermission: () => false,
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => window.localStorage.getItem('tm_token') || null);
  const [user, setUser] = useState(() => {
    const raw = window.localStorage.getItem('tm_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const result = await authApi.login(email, password);
      setToken(result.token);
      setUser(result.user);
      window.localStorage.setItem('tm_token', result.token);
      window.localStorage.setItem('tm_user', JSON.stringify(result.user));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem('tm_token');
    window.localStorage.removeItem('tm_user');
  }, []);

  const hasPermission = useCallback(
    (permission) => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      login,
      logout,
      hasPermission,
      loading,
    }),
    [token, user, login, logout, hasPermission, loading]
  );

  useEffect(() => {
    // Todo: Hook for future token expiry handling if needed
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
