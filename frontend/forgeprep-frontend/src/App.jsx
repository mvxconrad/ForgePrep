import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import TestResults from "./pages/TestResults";
import StudySetDetailsPage from "./pages/StudySetDetailsPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AITestInsightsPage from "./pages/AITestInsightsPage";
import TakeTestPage from "./pages/TakeTestPage";
import GeneratedTestPage from "./pages/GeneratedTestPage";
import StudySetsPage from "./pages/StudySetsPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Guest-Only Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* User and Admin Pages */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute component={Dashboard} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute component={ProfilePage} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute component={SettingsPage} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute component={FileUpload} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/testgenerator"
          element={<ProtectedRoute component={TestGenerator} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/classes"
          element={<ProtectedRoute component={Classes} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/templates"
          element={<ProtectedRoute component={Templates} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/study-sets"
          element={<ProtectedRoute component={StudySetsPage} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/test-results"
          element={<ProtectedRoute component={TestResults} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/study-set-details"
          element={<ProtectedRoute component={StudySetDetailsPage} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/take-test"
          element={<ProtectedRoute component={TakeTestPage} allowedRoles={["user", "admin"]} />}
        />
        <Route
          path="/generated-test"
          element={<ProtectedRoute component={GeneratedTestPage} allowedRoles={["user", "admin"]} />}
        />

        {/* Admin-Only Pages */}
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}
        />
        <Route
          path="/admin-analytics"
          element={<ProtectedRoute component={AdminAnalyticsPage} allowedRoles={["admin"]} />}
        />
        <Route
          path="/ai-test-insights"
          element={<ProtectedRoute component={AITestInsightsPage} allowedRoles={["admin"]} />}
        />
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
