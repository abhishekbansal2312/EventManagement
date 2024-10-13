import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie to manage cookies
import { useAuth } from "../provider/AuthProvider";

const Login = ({ darkMode }) => {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    const url = `http://localhost:4600/api/auth/login`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, password }),
        credentials: "include", // Include credentials to handle cookies
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setLoading(false);

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log(data);

      // Set the cookie instead of local storage
      Cookies.set("authtoken", data.token, { expires: 7, path: "" }); // Set cookie to expire in 7 days
      setIsAuthenticated(true);

      navigate("/"); // Redirect to home page on successful login
    } catch (err) {
      setLoading(false);
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
            Login
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="studentId"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Student ID:
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                id="studentId"
                placeholder="Enter 9 digit student ID"
                className="w-full p-3 border text-black border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                placeholder="Enter your password"
                className="w-full p-3 border text-black border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-indigo-500 text-white p-3 rounded-md hover:bg-indigo-600 transition-colors font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            {error && (
              <p className="mt-4 text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            )}
            <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
              Forget Password?{" "}
              <Link
                to="/auth/forgot-password"
                className="text-indigo-500 hover:underline"
              >
                Click Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
