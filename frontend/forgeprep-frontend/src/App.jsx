import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if user is logged in

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;

