import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";  // Ensure this file exists
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; // Ensure this file exists
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FileUpload from "./pages/FileUploadPage";  
import TestGenerator from "./pages/TestGeneratorPage";  
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Default route to LandingPage */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/fileupload" element={isAuthenticated ? <FileUpload /> : <Navigate to="/login" />} />
        <Route path="/testgenerator" element={isAuthenticated ? <TestGenerator /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

