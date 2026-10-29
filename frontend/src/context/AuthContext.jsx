/**
 * Authentication Context
 * Syllabus: Exp 7 & 11 (Session state sharing across React component tree via useContext)
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if session cookie is active on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await api.post('/auth/register', userData);
      setUser(res.data.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/auth/profile', updates);
      setUser(res.data.data);
      return { success: true, message: res.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update profile.';
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
