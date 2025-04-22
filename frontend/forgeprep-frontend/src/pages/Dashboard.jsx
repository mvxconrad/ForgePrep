import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Row, Col, Card, ListGroup,
  ProgressBar, Button, Form, Navbar, Nav
} from "react-bootstrap";
import { AuthContext } from "../components/AuthContext";
import styles from "./Dashboard.module.css";
import logo from "../assets/forgepreplogo.png";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const getGreeting = () => {
    const estTime = new Date().toLocaleString("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hour12: false,
    });
    const hour = parseInt(estTime);
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    fetchDashboardData();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("https://forgeprep.net/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user.");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

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
      setBackgroundImage(data.background_image || "");
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

  if (!currentUser) return <p className="text-white text-center mt-5">Loading...</p>;

  return (
    <div
      className="bg-dark text-light position-relative"
      style={{
        zIndex: 1,
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <Navbar expand="lg" className="px-4 py-2 position-sticky top-0 w-100" style={{ zIndex: 10, backgroundColor: 'rgba(13, 17, 23, 0.85)', backdropFilter: 'blur(12px)' }}>
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="ForgePrep Logo" height="64" />
          </Link>
          <Nav className="gap-2">
            <Link to="/upload" className="btn btn-outline-light btn-sm">Upload</Link>
            <Link to="/testgenerator" className="btn btn-outline-light btn-sm">Test Generator</Link>
            <Link to="/study-sets" className="btn btn-outline-light btn-sm">Study Sets</Link>
            <Link to="/logout" className="btn btn-light btn-sm text-dark fw-semibold">Log Out</Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-5 fw-bold text-white mb-5">
          {getGreeting()}, {currentUser?.username || user?.username || "User"} 👋
        </h1>

        <Row className="g-4">
          <Col md={6}>
            <Card className="glassCard">
              <div className="cardHeader">Recent Tests</div>
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
                <p className="text-muted">No recent tests yet.</p>
              )}
            </Card>
          </Col>

          <Col md={6}>
            <Card className="glassCard">
              <div className="cardHeader">Your Goals</div>
              {goals.length ? (
                <ListGroup variant="flush">
                  {goals.map((goal) => (
                    <ListGroup.Item key={goal.id} className="bg-transparent text-white">
                      {goal.title}
                      <ProgressBar now={goal.progress} label={`${goal.progress}%`} className="mt-2" />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No goals set yet.</p>
              )}
            </Card>
          </Col>

          <Col md={12}>
            <Card className="glassCard">
              <div className="cardHeader">Past Test Statistics</div>
              {statistics?.image && <img src={statistics.image} alt="Statistics" className="w-100 mb-3 rounded" />}
              {statistics?.average_score !== null ? (
                <div>
                  <p><strong>Average Score:</strong> {statistics.average_score}</p>
                  <p><strong>Best Score:</strong> {statistics.best_score}</p>
                  <p><strong>Lowest Score:</strong> {statistics.worst_score}</p>
                </div>
              ) : (
                <p className="text-muted">No statistics available yet.</p>
              )}
            </Card>
          </Col>

          <Col md={12}>
            <Card className="glassCard">
              <div className="cardHeader">AI-Powered Question Generator</div>
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
              <Card className="glassCard">
                <div className="cardHeader">Generated Questions</div>
                <ListGroup>
                  {generatedQuestions.map((q, idx) => (
                    <ListGroup.Item key={idx} className="bg-transparent text-white">{q}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Card>
            </Col>
          )}

          <Col md={12}>
            <Card className="glassCard">
              <div className="cardHeader">Notifications</div>
              {notifications.length > 0 ? (
                <ListGroup>
                  {notifications.map((note, idx) => (
                    <ListGroup.Item key={idx} className="bg-transparent text-white">
                      {note.message}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No notifications at this time.</p>
              )}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;