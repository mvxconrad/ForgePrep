import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider, AuthContext } from "./components/AuthContext";

// Pages
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
// import VerifyEmailPrompt from "./pages/VerifyEmailPrompt"; // ❌ Email verification disabled
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Components
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

const AppContent = () => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  const showNavbar = !["/", "/login", "/register"].includes(location.pathname);

  if (loading) {
    return <div className="text-white text-center mt-5">Loading...</div>;
  }

  return (
    <>
      {showNavbar && <AppNavbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        {/* <Route path="/verify-email-prompt" element={<VerifyEmailPrompt />} /> */}
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><FileUpload /></ProtectedRoute>} />
        <Route path="/testgenerator" element={<ProtectedRoute><TestGenerator /></ProtectedRoute>} />
        <Route path="/generated-test" element={<ProtectedRoute><GeneratedTestPage /></ProtectedRoute>} />
        <Route path="/take-test" element={<ProtectedRoute><TakeTestPage /></ProtectedRoute>} />
        <Route path="/test-results" element={<ProtectedRoute><TestResults /></ProtectedRoute>} />
        <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute><Classes /></ProtectedRoute>} />
        <Route path="/study-sets" element={<ProtectedRoute><StudySetsPage /></ProtectedRoute>} />
        <Route path="/study-sets/:id" element={<ProtectedRoute><StudySetDetailsPage /></ProtectedRoute>} />
        <Route path="/admin-analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />
        <Route path="/ai-insights" element={<ProtectedRoute><AITestInsightsPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
