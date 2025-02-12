import React, { useEffect, useState } from "react";
import axios from "axios";
import PerformanceChart from "../components/PerformanceChart";
import { Container, Table, Card } from "react-bootstrap";

const Dashboard = () => {
  const [testResults, setTestResults] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    dates: [],
    correct: [],
    incorrect: [],
  });

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/test-results`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        const results = response.data.slice(0, 5); // Get last 5 tests
        setTestResults(results);

        const dates = results.map((test) => test.date);
        const correct = results.map((test) => test.correctAnswers);
        const incorrect = results.map((test) => test.incorrectAnswers);

        setPerformanceData({ dates, correct, incorrect });
      } catch (error) {
        console.error("Error fetching test results:", error);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>

      {/* Performance Chart */}
      <Card className="mb-4 p-3">
        <h3>Performance Overview</h3>
        <PerformanceChart performanceData={performanceData} />
      </Card>

      {/* Recent Test Results */}
      <Card className="p-3">
        <h3>Recent Test Results</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Test Name</th>
              <th>Score</th>
              <th>Correct</th>
              <th>Incorrect</th>
            </tr>
          </thead>
          <tbody>
            {testResults.length > 0 ? (
              testResults.map((test, index) => (
                <tr key={index}>
                  <td>{new Date(test.date).toLocaleDateString()}</td>
                  <td>{test.testName}</td>
                  <td>{test.score}%</td>
                  <td>{test.correctAnswers}</td>
                  <td>{test.incorrectAnswers}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No test results available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default Dashboard;
