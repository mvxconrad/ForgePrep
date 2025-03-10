import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

import Navbar from "./components/Navbar";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/upload" element={<FileUpload />} />
        <Route path="/testgenerator" element={<TestGenerator />} />
        <Route path="/auth/github/callback" element={<GitHubCallback />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/classes" element={<Classes />} />
      </Routes>
    </Router>
  );
};

export default App;
