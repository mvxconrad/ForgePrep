import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FileUpload from "./pages/FileUploadPage";
import TestGenerator from "./pages/TestGeneratorPage";
import GitHubCallback from "./pages/GitHubCallback";
import Classes from "./pages/Classes";
import Templates from "./pages/Templates";
import Quizzes from "./pages/Quizzes";
import LandingPage from "./pages/LandingPage"; // Import the LandingPage
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard"; // Import the AdminDashboard
import TestResults from "./pages/TestResults"; // Import the TestResults

const ProtectedRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const location = useLocation();
  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    // Update isAuthenticated state based on token presence
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Set LandingPage as the default route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SettingsPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute isAuthenticated={isAuthenticated}><FileUpload /></ProtectedRoute>} />
        <Route path="/testgenerator" element={<ProtectedRoute isAuthenticated={isAuthenticated}><TestGenerator /></ProtectedRoute>} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
        <Route path="/templates" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Templates /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Quizzes /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Classes /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/test-results" element={<ProtectedRoute isAuthenticated={isAuthenticated}><TestResults /></ProtectedRoute>} />
        
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
