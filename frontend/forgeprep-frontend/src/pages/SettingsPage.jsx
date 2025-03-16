import React, { useEffect, useState } from "react";
import axios from "axios";
import PerformanceChart from "../components/PerformanceChart";
import { Container, Table, Card } from "react-bootstrap";
import settingsImage from "../assets/settings.png"; // Import the image

const SettingsPage = () => {
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
          `https://forgeprep.net/test-results/`, // Updated API URL
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("API response:", response.data); // Debugging log

        const results = Array.isArray(response.data) ? response.data.slice(0, 5) : []; // Ensure response data is an array
        setTestResults(results);

        const dates = results.map((test) => test.date);
        const correct = results.map((test) => test.correctAnswers);
        const incorrect = results.map((test) => test.incorrectAnswers);

        setPerformanceData({ dates, correct, incorrect });
      } catch (err) {
        console.error("Error fetching test results:", err);
      }
    };

    fetchTestResults();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Settings</h1>

      <Card className="mb-4 p-3">
        <div className="text-center mb-4">
          <img src={settingsImage} alt="Settings" style={{ width: "150px" }} />
        </div>
        <h3>Performance Overview</h3>
        <PerformanceChart performanceData={performanceData} />
      </Card>

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

export default SettingsPage;
