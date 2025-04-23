import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, ListGroup, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../util/apiService";
import backgroundImage from "../assets/background_abstract2.png";
import statisticsImage from "../assets/statistics.png";
import styles from "./Dashboard.module.css"; // reuse for glassCard

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
    <div
      className="bg-dark text-light"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={6}>
            {/* Profile Card */}
            <Card className={`${styles.glassCard} border-0 p-4 shadow mb-4`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="text-white fw-bold mb-0">Your Profile</h3>
                  <Button as={Link} to="/settings" variant="outline-light" size="sm">
                    Edit Profile
                  </Button>
                </div>
                {error ? (
                  <p className="text-danger">{error}</p>
                ) : (
                  <>
                    <p className="mb-2"><strong>Username:</strong> {profile.username}</p>
                    <p className="mb-0"><strong>Email:</strong> {profile.email}</p>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* Recent Tests */}
            <Card className={`${styles.glassCard} border-0 p-4 shadow`}>
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
    </div>
  );
};

export default ProfilePage;
