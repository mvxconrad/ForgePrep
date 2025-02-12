import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const PerformanceChart = ({ performanceData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={performanceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="correct" stroke="#82ca9d" />
        <Line type="monotone" dataKey="incorrect" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;

