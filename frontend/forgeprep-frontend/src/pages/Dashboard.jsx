import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, ProgressBar, Button, Form } from "react-bootstrap";
import statisticsImage from "../assets/statistics.jpg";
import api from "../utils/apiService";
import { useNavigate } from "react-router-dom"; // Needed for navigation

const Dashboard = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [username, setUsername] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchUsername();
    fetchDashboardData();
  }, []);

  const fetchUsername = async () => {
    try {
      const response = await api.get("/users/");
      setUsername(response.data.username);
    } catch (err) {
      console.error("Error fetching username:", err);
      setError("Failed to fetch username.");
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard/");
      setRecentTests(response.data.recent_tests);
      setStatistics(response.data.statistics);
      // Optionally set goals/notifications if included in backend response
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data.");
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const response = await api.post("/gpt/generate", { prompt });
      setGeneratedQuestions(response.data.questions);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError("Failed to generate questions.");
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <h2>{`${getGreeting()}, ${username || "User"}!`}</h2>

      {/* Recent Tests and Goals */}
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

      {/* Recently Generated Tests */}
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

      {/* Quick Actions */}
      <Card className="mb-4">
        <Card.Header>Quick Actions</Card.Header>
        <Card.Body>
          <Button variant="primary" className="me-2" href="/upload">Upload Files</Button>
          <Button variant="success" className="me-2" href="/testgenerator">Generate Test</Button>
          <Button variant="info" href="/study-sets">View Study Sets</Button>
        </Card.Body>
      </Card>

      {/* Statistics Section */}
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

      {/* Progress Overview */}
      <Card className="mb-4">
        <Card.Header>Progress Overview</Card.Header>
        <Card.Body>
          <ProgressBar now={statistics?.averageScore || 0} label={`${statistics?.averageScore || 0}%`} />
        </Card.Body>
      </Card>

      {/* Notifications */}
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

      {/* AI Question Generator */}
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

      {/* Generated Questions */}
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
