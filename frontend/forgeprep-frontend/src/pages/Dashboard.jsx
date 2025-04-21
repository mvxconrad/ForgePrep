import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, ListGroup,
  ProgressBar, Button, Form
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import statisticsImage from "../assets/statistics.jpg";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("https://forgeprep.net/api/dashboard", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Dashboard fetch failed.");
      const data = await res.json();
      setRecentTests(data.recent_tests || []);
      setGoals(data.goals || []);
      setStatistics(data.statistics || null);
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const handleGenerateQuestions = async () => {
    try {
      const res = await fetch("/api/gpt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setGeneratedQuestions(data.questions || []);
    } catch (err) {
      console.error("Question generation failed:", err);
      setError("Could not generate questions.");
    }
  };

  return (
    <div className={styles.containerBackground}>
      <Container>
        <h1 className={styles.sectionTitle}>
          {getGreeting()}, {user?.username || "User"} 👋
        </h1>

        <Row className="g-4">
          <Col md={6}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Recent Tests</div>
              {recentTests.length ? (
                <ListGroup variant="flush">
                  {recentTests.map((test) => (
                    <ListGroup.Item key={test.id} className="bg-transparent text-white d-flex justify-content-between">
                      {test.name}
                      <span className="badge bg-primary">{test.score}%</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No recent tests.</p>
              )}
            </Card>
          </Col>

          <Col md={6}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Your Goals</div>
              {goals.length ? (
                <ListGroup variant="flush">
                  {goals.map((goal) => (
                    <ListGroup.Item key={goal.id} className="bg-transparent text-white">
                      {goal.title}
                      <ProgressBar
                        now={goal.progress}
                        label={`${goal.progress}%`}
                        className="mt-2"
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No goals set yet.</p>
              )}
            </Card>
          </Col>

          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Quick Actions</div>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="primary" href="/upload">Upload Files</Button>
                <Button variant="success" href="/testgenerator">Generate Test</Button>
                <Button variant="info" href="/study-sets">Study Sets</Button>
              </div>
            </Card>
          </Col>

          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Past Test Statistics</div>
              <img src={statisticsImage} alt="Statistics" className="w-100 mb-3 rounded" />
              {statistics ? (
                <div>
                  <p><strong>Average Score:</strong> {statistics.averageScore}%</p>
                  <p><strong>Best Score:</strong> {statistics.bestScore}%</p>
                  <p><strong>Lowest Score:</strong> {statistics.worstScore}%</p>
                </div>
              ) : (
                <p>No statistics available.</p>
              )}
            </Card>
          </Col>

          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>AI-Powered Question Generator</div>
              <Form.Group controlId="formPrompt" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter a topic or prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </Form.Group>
              <Button onClick={handleGenerateQuestions} variant="primary">
                Generate Questions
              </Button>
              {error && <p className="text-danger mt-3">{error}</p>}
            </Card>
          </Col>

          {generatedQuestions.length > 0 && (
            <Col md={12}>
              <Card className={styles.glassCard}>
                <div className={styles.cardHeader}>Generated Questions</div>
                <ListGroup>
                  {generatedQuestions.map((q, idx) => (
                    <ListGroup.Item key={idx} className="bg-transparent text-white">{q}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          )}

          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Notifications</div>
              {notifications.length > 0 ? (
                <ListGroup>
                  {notifications.map((note, idx) => (
                    <ListGroup.Item key={idx} className="bg-transparent text-white">
                      {note.message}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No notifications at this time.</p>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
