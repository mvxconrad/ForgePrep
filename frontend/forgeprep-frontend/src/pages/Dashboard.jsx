import React from "react";
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
      <PerformanceChart performanceData={mockPerformanceData} />
    </div>
  );
};

export default Dashboard;

