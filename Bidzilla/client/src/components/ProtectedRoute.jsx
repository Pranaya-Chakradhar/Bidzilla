// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useContext(AuthContext);

  // If no user logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not allowed, redirect to login (or you can choose a "not authorized" page)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access to the component
  return children;
};

export default ProtectedRoute;
