import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const cookies = new Cookies();

export default function ProtectedRoutes({ children, requiredRole }) {
  const token = cookies.get("TOKEN");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  try {
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
}
