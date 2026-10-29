/**
 * ProtectedRoute Component
 * Syllabus: Exp 8 (React Router navigation guards & authentication wrappers)
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader text="Verifying session credentials..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and preserve requested destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Non-admin attempting to access restricted view
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
