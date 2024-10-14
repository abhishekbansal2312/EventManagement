import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Make sure you have this package installed

const Navbar = ({ darkMode }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State for admin check
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("authtoken");
    setIsAuthenticated(!!token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setIsAdmin(decodedToken.role === "admin"); // Check if the user is an admin
      } catch (error) {
        console.error("Invalid token", error);
        setIsAdmin(false); // Reset admin state if token is invalid
      }
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    Cookies.remove("authtoken");
    fetch("http://localhost:4600/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Logout failed");
        setIsAuthenticated(false);
        setIsAdmin(false); // Reset admin state on logout
        navigate("/login");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <nav
      className={`shadow-md ${
        darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center p-4 border-b border-gray-100">
        <div className="font-bold text-xl">
          <Link
            to="/"
            className={`flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            <p className="text-xl font-semibold">MIT HOBBIES CLUB</p>
          </Link>
        </div>

        {/* Desktop Menu Items */}
        <div className="hidden md:flex items-center">
          <Link
            to="/"
            className={` border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
              darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
            }`}
          >
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/live"
                className={`border-l relative pr-3 pl-3 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                }`}
              >         
              <span className="absolute top-2 left-0 w-2 h-2 bg-red-500 rounded-full animate-blink"></span>
                Live{" "}
       
              </Link>
              <Link
                to="/members"
                className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                }`}
              >
                Members
              </Link>
              {isAdmin && ( // Render Users link only for admin
                <Link
                  to="/users"
                  className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                    darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                  }`}
                >
                  Users
                </Link>
              )}
              <Link
                to="/events"
                className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                }`}
              >
                Events
              </Link>
              <Link
                to="/gallery"
                className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                }`}
              >
                Gallery
              </Link>
              <button
                onClick={handleLogout}
                className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`border-l border-gray-300 pr-3 pl-3 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:text-gray-400" : "text-black hover:text-gray-600"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            className={`focus:outline-none ${
              darkMode ? "text-gray-300" : "text-black"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden ${isDropdownOpen ? "block" : "hidden"} ${
          darkMode ? "bg-gray-900 border-t border-gray-700" : "bg-gray-100 border-t border-gray-300"
        }`}
      >
        <Link
          to="/"
          className={`block px-4 py-2 transition-colors duration-300 ${
            darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
          }`}
        >
          Home
        </Link>

        {isAuthenticated ? (
          <>
            <Link
              to="/live"
              className={`relative block px-4 py-2 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
              }`}
            >
              Live{" "}
              <span className="absolute top-4 left-1 w-2 h-2 bg-red-500 rounded-full animate-blink"></span>
            </Link>
            <Link
              to="/members"
              className={`block px-4 py-2 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
              }`}
            >
              Members
            </Link>
            {isAdmin && ( // Render Users link only for admin
              <Link
                to="/users"
                className={`block px-4 py-2 transition-colors duration-300 ${
                  darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
                }`}
              >
                Users
              </Link>
            )}
            <Link
              to="/events"
              className={`block px-4 py-2 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
              }`}
            >
              Events
            </Link>
            <Link
              to="/gallery"
              className={`block px-4 py-2 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
              }`}
            >
              Gallery
            </Link>
            <button
              onClick={handleLogout}
              className={`block w-full text-left px-4 py-2 transition-colors duration-300 ${
                darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`block px-4 py-2 transition-colors duration-300 ${
              darkMode ? "text-gray-300 hover:bg-gray-800" : "text-black hover:bg-gray-200"
            }`}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
