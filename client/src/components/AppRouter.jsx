import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";
import Header from "../components/Header";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import Members from "../pages/Members";
import Gallery from "../pages/Gallery";
import GalleryPage from "../pages/GalleryPage";
import Events from "../pages/Events";
import CreateEvent from "./event/CreateEvent";
import EventPage from "../pages/EventPage";
import EventEdit from "../components/event/EventEdit";
import DarkMode from "../components/DarkMode";
import Footer from "./Footer";
import Users from "./user/Users";
import ProtectedRouteAdminOnly from "./ProtectedRouteAdminOnly";
import Review from "../pages/Review";

const AppRouter = () => {
  const { isAuthenticated, setIsAuthenticated, darkMode, setDarkMode } =
    useAuth();
  return (
    <div>
      <div className={`flex flex-col min-h-screen`}>
        {/* Conditionally render the Header */}
        {isAuthenticated && (
          <Header
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            darkMode={darkMode}
          />
        )}

        {/* Main content with routes */}
        <main className="flex-grow main-content">
          <Routes>
            {/* Home page (public) */}
            <Route
              path="/"
              element={
                <Home
                  setIsAuthenticated={setIsAuthenticated}
                  darkMode={darkMode}
                />
              }
            />

            {/* Login and Register are public routes */}
            <Route
              path="/login"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  darkMode={darkMode}
                />
              }
            />
            {/* <Route path="/register" element={<Signup darkMode={darkMode} />} /> */}

            {/* Protected routes */}
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <Members darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery"
              element={
                <ProtectedRoute>
                  <Gallery
                    setIsAuthenticated={setIsAuthenticated}
                    darkMode={darkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gallery/:id"
              element={
                <ProtectedRoute>
                  <GalleryPage darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id"
              element={
                <ProtectedRoute>
                  <EventPage darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/event/:id/edit"
              element={
                <ProtectedRoute>
                  <EventEdit darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRouteAdminOnly>
                  <Users darkMode={darkMode} />
                </ProtectedRouteAdminOnly>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Review darkMode={darkMode} />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Dark mode toggle and footer */}
        <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
        {isAuthenticated && <Footer darkMode={darkMode} />}
      </div>
    </div>
  );
};

export default AppRouter;
