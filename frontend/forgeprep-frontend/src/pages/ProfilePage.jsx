import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, ListGroup, Spinner } from "react-bootstrap";
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
        const [profileRes, testsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/dashboard"),
        ]);
        setProfile(profileRes.data);
        setRecentTests(testsRes.data?.recent_tests || []);
      } catch (err) {
        console.error("Profile/test load error:", err);
        setError("Failed to load profile or recent tests.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  return (
    <Container className="py-5 text-light">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="glassCard mb-4 p-4 border-0 shadow">
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

          <Card className="glassCard p-4 border-0 shadow">
            <Card.Body>
              <h4 className="fw-bold mb-3 text-white">Recent Tests</h4>
              {recentTests.length > 0 ? (
                <ListGroup variant="flush">
                  {recentTests.map((test) => (
                    <ListGroup.Item
                      key={test.id}
                      className="bg-transparent d-flex justify-content-between align-items-center text-white"
                    >
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
