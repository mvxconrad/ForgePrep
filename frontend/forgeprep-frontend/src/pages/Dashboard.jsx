import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, ProgressBar, Button, Form } from "react-bootstrap";
import statisticsImage from "../assets/statistics.jpg"; // Import the image
import axios from "axios";

const Dashboard = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [username, setUsername] = useState(""); // Fetch username from /api/users/profile
  const [prompt, setPrompt] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]); // Add state for notifications

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchUsername(); // Fetch username from /api/users/profile
  }, []);

  useEffect(() => {
    console.log("Username state updated:", username); // Debugging log
  }, [username]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("https://forgeprep.net/api/dashboard/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      }
    };

    fetchDashboardData();
  }, []);

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is missing");
      }

      // Decode the token to get the user ID
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const userId = decodedToken.id;
      if (!userId) {
        throw new Error("User ID is missing in the token");
      }

      const response = await fetch(`https://forgeprep.net/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User profile data:", data);
      setUsername(data.username);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const token = localStorage.getItem("token");
      const questions = await axios.post(
        "/api/gpt/generate",
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGeneratedQuestions(questions.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <h2>{`${getGreeting()}, ${username || "User"}!`}</h2>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Recent Tests</Card.Header>
            <Card.Body>
              {recentTests.length > 0 ? (
                <ListGroup>
                  {recentTests.map((test) => (
                    <ListGroup.Item key={test.id} className="d-flex justify-content-between align-items-center">
                      {test.name}
                      <span className="badge bg-primary rounded-pill">{test.score}%</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No recent tests available.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Your Goals</Card.Header>
            <Card.Body>
              {goals.length > 0 ? (
                <ListGroup>
                  {goals.map((goal) => (
                    <ListGroup.Item key={goal.id}>
                      {goal.title}
                      <ProgressBar now={goal.progress} label={`${goal.progress}%`} className="mt-2" />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No goals set yet.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Header>Recently Generated Tests</Card.Header>
        <Card.Body>
          {recentTests.length > 0 ? (
            <ListGroup>
              {recentTests.map((test) => (
                <ListGroup.Item key={test.id}>
                  {test.name} - {test.date}
                  <Button
                    variant="primary"
                    className="ms-3"
                    onClick={() => navigate("/take-test", { state: { test } })}
                  >
                    Take Test
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No tests generated recently.</p>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Quick Actions</Card.Header>
        <Card.Body>
          <Button variant="primary" className="me-2" href="/upload">Upload Files</Button>
          <Button variant="success" className="me-2" href="/testgenerator">Generate Test</Button>
          <Button variant="info" href="/study-sets">View Study Sets</Button>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Past Test Statistics</Card.Header>
        <Card.Body>
          <img src={statisticsImage} alt="Statistics" style={{ width: "100%", height: "auto" }} />
          {statistics ? (
            <div>
              <p><strong>Average Score:</strong> {statistics.averageScore}%</p>
              <p><strong>Best Score:</strong> {statistics.bestScore}%</p>
              <p><strong>Worst Score:</strong> {statistics.worstScore}%</p>
            </div>
          ) : (
            <p>No statistics available.</p>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Progress Overview</Card.Header>
        <Card.Body>
          <ProgressBar now={statistics?.averageScore || 0} label={`${statistics?.averageScore || 0}%`} />
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Notifications</Card.Header>
        <Card.Body>
          {notifications.length > 0 ? (
            <ListGroup>
              {notifications.map((notification, index) => (
                <ListGroup.Item key={index}>{notification.message}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No notifications available.</p>
          )}
        </Card.Body>
      </Card>

      <Card className="p-3 mb-4">
        <h3>AI-Powered Question Generator</h3>
        <Form.Group controlId="formPrompt" className="mb-3">
          <Form.Label>Enter a Prompt</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a topic or question prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </Form.Group>
        <Button onClick={handleGenerateQuestions} variant="primary">
          Generate Questions
        </Button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Card>

      {generatedQuestions.length > 0 && (
        <Card className="p-3">
          <h3>Generated Questions</h3>
          <ListGroup>
            {generatedQuestions.map((question, index) => (
              <ListGroup.Item key={index}>{question}</ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;
