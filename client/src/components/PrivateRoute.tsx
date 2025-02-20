import React, { JSX, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { token, role } = useContext(AuthContext);

  // If not authenticated, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the current user does not have it, redirect to home 
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected component
  return children;
};

export default PrivateRoute;
