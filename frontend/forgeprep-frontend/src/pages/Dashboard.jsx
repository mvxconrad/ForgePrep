import React from "react";
import { Link } from "react-router-dom";
import PerformanceChart from "../components/PerformanceChart";

const Dashboard = () => {
  const mockPerformanceData = {
    dates: ["Jan", "Feb", "Mar"],
    correct: [5, 7, 8],
    incorrect: [2, 3, 1],
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="/profile">Profile</Link> | 
        <Link to="/settings">Settings</Link> | 
        <Link to="/fileupload">File Upload</Link> | 
        <Link to="/testgenerator">Test Generator</Link> | 
        <Link to="/" onClick={() => localStorage.removeItem("token")}>Logout</Link>
      </nav>
      <PerformanceChart performanceData={mockPerformanceData} />
    </div>
  );
};

export default Dashboard;

