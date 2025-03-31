import React, { useEffect, useState } from "react";
import axios from "axios";
import PerformanceChart from "../components/PerformanceChart";
import { Container, Table, Card, Form, Button } from "react-bootstrap";
import settingsImage from "../assets/settings.png"; // Import the image

const SettingsPage = () => {
  const [testResults, setTestResults] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    dates: [],
    correct: [],
    incorrect: [],
  });
  const [settings, setSettings] = useState({ theme: "", notifications: false });
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(
          `https://forgeprep.net/api/test-results/`, // Updated API URL
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/users/settings", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Check if the response is not OK
        if (!response.ok) {
          const errorText = await response.text(); // Read the response as text
          console.error("Error response:", errorText); // Log the error response
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Settings data fetched:", data); // Debugging log
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err.message);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://forgeprep.net/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(settings),
      });

      // Check if the response is not OK
      if (!response.ok) {
        const errorText = await response.text(); // Read the response as text
        console.error("Error response:", errorText); // Log the error response
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Settings data updated:", data); // Debugging log
      setSettings(data);
    } catch (err) {
      console.error("Error updating settings:", err);
      setError(err.message);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://forgeprep.net/api/users/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ password, notifications, theme }),
      });

      if (!response.ok) {
        throw new Error("Failed to save settings");
      }

      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

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

      <Card className="p-3 mb-4">
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

      <Form onSubmit={handleSaveSettings}>
        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Change Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formNotifications" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Enable Email Notifications"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </Form.Group>
        <Form.Group controlId="formTheme" className="mb-3">
          <Form.Label>Preferred Theme</Form.Label>
          <Form.Select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">Save Settings</Button>
      </Form>
    </Container>
  );
};

export default SettingsPage;
