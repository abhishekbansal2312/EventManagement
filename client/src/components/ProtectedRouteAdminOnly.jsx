import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Correctly import jwtDecode

const ProtectedRouteAdminOnly = ({ children }) => {
  // Check if the token exists in the cookies
  const token = Cookies.get("authtoken");
  const isAuthenticated = Boolean(token);
  
  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  } 

  try {
    const decodedToken = jwtDecode(token); // Decode the JWT token

    // Check if the role is admin
    if (decodedToken.role === "admin") {
      // If role is admin, allow access to the admin dashboard
      return children;
    } else {
      // If role is not admin, redirect to unauthorized page or homepage
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.error("Invalid token", error);
    // Redirect to login in case of an invalid token
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRouteAdminOnly;
