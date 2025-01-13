import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correctly import jwtDecode

const ProtectedRouteAdminOnly = ({ children }) => {
  // Check if the token exists in the cookies
  const token = Cookies.get("authtoken");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    if (decodedToken.role === "admin") {
      return children;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRouteAdminOnly;
