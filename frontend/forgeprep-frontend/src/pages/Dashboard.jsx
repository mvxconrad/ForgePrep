import React, { useEffect, useState, useContext } from "react";
import {
  Container, Row, Col, Card, ListGroup,
  ProgressBar, Button, Spinner
} from "react-bootstrap";
import { AuthContext } from "../components/AuthContext";
import styles from "./Dashboard.module.css";
import statisticsImage from "../assets/statistics.png";
import backgroundFallback from "../assets/background_abstract2.png";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(backgroundFallback);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUser();
    fetchDashboardData();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("https://forgeprep.net/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setCurrentUser(data);
    } catch (err) {
      console.error("[Dashboard] User fetch error:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("https://forgeprep.net/api/dashboard", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Dashboard fetch failed");
      const data = await res.json();
      setRecentTests(data.recent_tests || []);
      setGoals(data.goals || []);
      setStatistics(data.statistics || {});
      setNotifications(data.notifications || []);
      setBackgroundImage(data.background_image || backgroundFallback);
    } catch (err) {
      console.error("[Dashboard] Data fetch error:", err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (!currentUser) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div
      className="text-light position-relative"
      style={{
        zIndex: 1,
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container className="py-5 position-relative" style={{ zIndex: 2 }}>
        <h1 className="display-5 fw-bold text-white mb-5">
          {getGreeting()}, {currentUser.username || user?.username || "User"} 👋
        </h1>

        <Row className="g-4">
          {/* Recent Tests */}
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
                <p className="text-muted">No recent tests yet.</p>
              )}
            </Card>
          </Col>

          {/* Goals */}
          <Col md={6}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Your Goals</div>
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

          {/* Statistics */}
          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>Past Test Statistics</div>
              <img src={statisticsImage} alt="Statistics" className="w-100 mb-3 rounded" />
              {statistics?.average_score !== undefined ? (
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

          {/* Notifications */}
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
                <p className="text-muted">No notifications at this time.</p>
              )}
            </Card>
          </Col>

          {/* Quick Actions */}
          <Col md={12}>
            <Card className={styles.glassCard}>
              <div className={styles.cardHeader}>🧰 Quick Actions</div>
              <div className="d-flex flex-wrap gap-3 p-3">
                <Button
                  variant="light"
                  className="fw-semibold shadow-sm rounded-pill px-4 py-2 text-dark custom-hover"
                  onClick={() => window.location.href = "/upload"}
                >
                  📁 Upload Study Guide
                </Button>
                <Button
                  variant="light"
                  className="fw-semibold shadow-sm rounded-pill px-4 py-2 text-dark custom-hover"
                  onClick={() => window.location.href = "/testgenerator"}
                >
                  🧠 Generate Test
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Button hover override */}
      <style>
        {`
          .custom-hover:hover {
            background-color: #f0f0f0 !important;
            color: #000 !important;
            transition: background-color 0.3s ease, color 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
