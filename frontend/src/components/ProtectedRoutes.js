import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from './AuthContext';

export default function ProtectedRoutes({ children, requiredRole }) {
  const { isLoggedIn,userRole  } = useContext(AuthContext); 
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  try {
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
}
