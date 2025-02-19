import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import FileUpload from "./pages/FileUploadPage";
import TestGenerator from "./pages/TestGeneratorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <GoogleOAuthProvider clientId="588883044961-15sl1jthtte8vqsh2aodu7lqf16r3i55.apps.googleusercontent.com">
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          {/* Uncomment the following line to redirect based on authentication status */}
          {/* <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/profile" element={<ProtectedRoute component={ProfilePage} />} />
          <Route path="/settings" element={<ProtectedRoute component={SettingsPage} />} />
          <Route path="/upload" element={<ProtectedRoute component={FileUpload} />} />
          <Route path="/testgenerator" element={<ProtectedRoute component={TestGenerator} />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
