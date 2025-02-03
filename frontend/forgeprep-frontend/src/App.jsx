import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import TestGeneratorPage from "./pages/TestGeneratorPage";
import FileUploadPage from "./pages/FileUploadPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-generator" element={<TestGeneratorPage />} />
        <Route path="/file-upload" element={<FileUploadPage />} />
      </Routes>
    </Router>
  );
};

export default App;

