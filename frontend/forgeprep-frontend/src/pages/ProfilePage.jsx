import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap";
import api from "../util/apiService";
import statisticsImage from "../assets/statistics.png";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [recentTests, setRecentTests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get("/auth/me");
        const testsRes = await api.get("/dashboard");
        setProfile(profileRes.data);
        setRecentTests(testsRes.data?.recent_tests || []);
      } catch (err) {
        setError("Failed to load profile or recent tests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-light" role="status" />
      </Container>
    );
  }

  return (
    <Container className="py-5 text-light">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="glassCard mb-4 p-4">
            <Card.Body>
              <h3 className="fw-bold mb-4 text-white">Your Profile</h3>
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <p><strong>Username:</strong> {profile.username}</p>
                  <p><strong>Email:</strong> {profile.email}</p>
                </>
              )}
            </Card.Body>
          </Card>

          <Card className="glassCard p-4">
            <Card.Body>
              <h4 className="fw-bold mb-3 text-white">Recent Tests</h4>
              {recentTests.length > 0 ? (
                <ListGroup variant="flush">
                  {recentTests.map((test) => (
                    <ListGroup.Item key={test.id} className="bg-transparent d-flex justify-content-between text-white">
                      {test.name}
                      <span className="badge bg-primary">{test.score}%</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No recent tests found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
