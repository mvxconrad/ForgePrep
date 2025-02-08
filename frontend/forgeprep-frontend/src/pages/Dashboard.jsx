import React from "react";
import { Link } from "react-router-dom";
import PerformanceChart from "../components/PerformanceChart";

const Dashboard = () => {
  const mockPerformanceData = [
    { date: "Jan", correct: 5, incorrect: 2 },
    { date: "Feb", correct: 7, incorrect: 3 },
    { date: "Mar", correct: 8, incorrect: 1 },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/fileupload">File Upload</Link></li>
          <li><Link to="/testgenerator">Test Generator</Link></li>
        </ul>
      </nav>
      <PerformanceChart performanceData={mockPerformanceData} />
    </div>
  );
};

export default Dashboard;

