import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode"; // Ensure you import jwtDecode

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthenticateMember = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = Cookies.get("authtoken");
    if (token) {
      const decodedToken = jwtDecode(token);
      return decodedToken.role === "member"; // Check if the role is 'member'
    }
    return false; // Return false if no token
  });

  return (
    // <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
    //   {children}
    // </AuthContext.Provider>
    <></>
  );
};

// Custom hook to use AuthContext
// export const useAuth = () => {
//   return useContext(AuthContext);
// };
