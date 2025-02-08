import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRouteAdminOnly = ({ children }) => {
  const { isLoggedIn, user } = useSelector((state) => state.user);

  // Redirect if not authenticated
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Allow access only if user is an admin
  return user?.role === "admin" ? children : <Navigate to="/" replace />;
};

export default ProtectedRouteAdminOnly;
