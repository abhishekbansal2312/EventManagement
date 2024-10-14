import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Header from './components/Header';
import DarkMode from './components/DarkMode';
import Footer from './components/Footer';
import Signup from './pages/Signup';
import Members from './pages/Members';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';
import Users from './components/Users';
import Cookies from 'js-cookie'; // For token management
import Events from './pages/Events';
import CreateEvent from './components/CreateEvent';
import EventPage from './pages/EventPage';
import EventEdit from './components/EventEdit';
import GalleryPage from './pages/GalleryPage';
import { Navigate } from 'react-router-dom';
import Live from './pages/Live';
import ProtectedRouteAdminOnly from './components/ProtectedRouteAdminOnly';

const App = () => {
  // Auth state based on cookie presence
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = Cookies.get('authtoken'); // Make sure this matches your authentication logic
    return !!token; // Authenticated if token exists
  });

  // Dark mode state from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  // Handle dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Get the current location
  const location = useLocation();

  return (
    <div className={`flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Conditionally render the Header */}
      {location.pathname !== '/login' && (
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />
      )}

      {/* Main content with routes */}
      <main className="flex-grow">
        <Routes>
          {/* Home page (public) */}
          <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />} />

          {/* Login and Register are public routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />} />
          {/* <Route path="/register" element={<Signup darkMode={darkMode} />} /> */}

          {/* Protected routes */}
          <Route path="/members" element={
            <ProtectedRoute>
              <Members darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/gallery" element={
            <ProtectedRoute>
              <Gallery setIsAuthenticated={setIsAuthenticated} darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/gallery/:id" element={
            <ProtectedRoute>
              <GalleryPage darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <Events darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/events/create-event" element={
            <ProtectedRoute>
              <CreateEvent darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/event/:id" element={
            <ProtectedRoute>
              <EventPage darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/event/:id/edit" element={
            <ProtectedRoute>
              <EventEdit darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/live" element={
            <ProtectedRoute>
              <Live darkMode={darkMode} />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRouteAdminOnly>
              <Users darkMode={darkMode} />
            </ProtectedRouteAdminOnly>
          } />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
      </main>

      {/* Dark mode toggle and footer */}
      <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
};

// Wrap the App component with Router to provide routing context
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
