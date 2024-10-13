import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Ensure package is installed
import { MenuIcon, XIcon } from "@heroicons/react/solid"; // For modern icons
import { useAuth } from "../provider/AuthProvider";

const Navbar = ({ darkMode }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State for admin check
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

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
        setIsAuthenticated(false);
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <nav
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-lg transition-colors duration-300`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-16">
        {/* Logo */}
        <div className="font-bold text-2xl">
          <Link
            to="/"
            className={`flex items-center space-x-2 ${
              darkMode
                ? "text-white hover:text-gray-300"
                : "text-gray-900 hover:text-blue-500"
            } transition-all duration-300`}
          >
            <p>MIT Hobbies Club</p>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className={`transition-all duration-300 ${
              darkMode
                ? "text-gray-300 hover:text-gray-400"
                : "text-gray-900 hover:text-blue-500"
            }`}
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/live"
                className={`relative transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-gray-400"
                    : "text-gray-900 hover:text-blue-500"
                }`}
              >
                Live{" "}
                <span className="absolute top-0 left-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              </Link>
              <Link
                to="/members"
                className={`transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-gray-400"
                    : "text-gray-900 hover:text-blue-500"
                }`}
              >
                Members
              </Link>
              {isAdmin && (
                <Link
                  to="/users"
                  className={`transition-all duration-300 ${
                    darkMode
                      ? "text-gray-300 hover:text-gray-400"
                      : "text-gray-900 hover:text-blue-500"
                  }`}
                >
                  Users
                </Link>
              )}
              <Link
                to="/events"
                className={`transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-gray-400"
                    : "text-gray-900 hover:text-blue-500"
                }`}
              >
                Events
              </Link>
              <Link
                to="/gallery"
                className={`transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-gray-400"
                    : "text-gray-900 hover:text-blue-500"
                }`}
              >
                Gallery
              </Link>
              <button
                onClick={handleLogout}
                className={`transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-red-400"
                    : "text-gray-900 hover:text-red-500"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-gray-400"
                  : "text-gray-900 hover:text-blue-500"
              }`}
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleDropdown}
            className={`transition-all duration-300 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {isDropdownOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden transition-all duration-300 ${
          isDropdownOpen ? "block" : "hidden"
        } ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}
      >
        <Link
          to="/"
          className={`block px-4 py-2 transition-all duration-300 ${
            darkMode
              ? "text-gray-300 hover:bg-gray-700"
              : "text-gray-900 hover:bg-gray-100"
          }`}
        >
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link
              to="/live"
              className={`relative block px-4 py-2 transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              Live{" "}
              <span className="absolute top-2 left-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </Link>
            <Link
              to="/members"
              className={`block px-4 py-2 transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              Members
            </Link>
            {isAdmin && (
              <Link
                to="/users"
                className={`block px-4 py-2 transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                Users
              </Link>
            )}
            <Link
              to="/events"
              className={`block px-4 py-2 transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              Events
            </Link>
            <Link
              to="/gallery"
              className={`block px-4 py-2 transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              Gallery
            </Link>
            <button
              onClick={handleLogout}
              className={`block w-full text-left px-4 py-2 transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100"
              }`}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`block px-4 py-2 transition-all duration-300 ${
              darkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-900 hover:bg-gray-100"
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
