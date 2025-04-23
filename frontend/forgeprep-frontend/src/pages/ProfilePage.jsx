import React, { useEffect, useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../util/apiService";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/me"); // ✅ matches backend
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="glassCard p-4 border-0 shadow">
            <Card.Body className="text-center">
              <h3 className="mb-4 fw-bold text-white">Your Profile</h3>
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <p className="text-white mb-2"><strong>Username:</strong> {profile.username || "N/A"}</p>
                  <p className="text-white mb-4"><strong>Email:</strong> {profile.email || "N/A"}</p>
                </>
              )}
              <Button as={Link} to="/settings" variant="light" className="w-100 text-dark fw-semibold">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
