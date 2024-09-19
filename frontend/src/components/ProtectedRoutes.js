import React from "react";
import { Route, Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function ProtectedRoutes({ children }) {
  const token = cookies.get("TOKEN");

  return token ? children : <Navigate to="/" replace />;
}
