import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const RequireAuth: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) {
    // Redirect to dashboard root but we rely on modal, so send home with state
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  return <Outlet />;
};

export const RequireAdmin: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

