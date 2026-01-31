import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PerformanceChart = ({ performanceData }) => {
  const data = {
    labels: performanceData.dates,
    datasets: [
      {
        label: "Correct Answers",
        data: performanceData.correct,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
      {
        label: "Incorrect Answers",
        data: performanceData.incorrect,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Over Time",
      },
    },
  };

  if (!data || data.datasets.length === 0) {
    return <p>No performance data available.</p>;
  }

  return <Line data={data} options={options} />;
};

export default PerformanceChart;

