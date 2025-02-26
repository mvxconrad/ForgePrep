import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";

const Dashboard = () => {
  const [recentTests, setRecentTests] = useState([]);
  const [goals, setGoals] = useState([]);
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const testResponse = await fetch("http://18.221.47.222:8000/api/tests/recent");
        const goalResponse = await fetch("http://18.221.47.222:8000/api/goals");
        const statsResponse = await fetch("http://18.221.47.222:8000/api/stats");

        const testsData = await testResponse.json();
        const goalsData = await goalResponse.json();
        const statsData = await statsResponse.json();

        setRecentTests(testsData);
        setGoals(goalsData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>

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
