import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ roles = [], children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check roles if specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children ? children : <Outlet />;
};

export default PrivateRoute;