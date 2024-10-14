import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authtoken"); // Make sure this matches your token name
  console.log("token", token);

  const isAuthenticated = Boolean(token);
  console.log("isAuthenticated", isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;
