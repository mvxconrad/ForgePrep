import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import statisticsImage from "../assets/statistics.jpg"; // Import the image

const Dashboard = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [username, setUsername] = useState(""); // Remove mock username

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/dashboard/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dashboard data:", data);

        if (data.username) {
          setUsername(data.username);
        } else {
          console.warn("Username not found in the response data");
        }

        setRecentTests(data.recentTests || []);
        setGoals(data.goals || []);
        setStatistics(data.statistics || null);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>
      <h2>Welcome, {username}!</h2> {/* Display the user's name */}

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
                      {goal.title} - <strong>{goal.progress}%</strong> completed
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
    </Container>
  );
};

export default Dashboard;
