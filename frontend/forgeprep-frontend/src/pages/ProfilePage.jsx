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
        const response = await api.get("/users/profile");
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
          <Card className="shadow-lg border-0">
            <Card.Body className="text-center">
              <h3 className="mb-3 fw-semibold">Your Profile</h3>
              {error ? (
                <p className="text-danger">{error}</p>
              ) : (
                <>
                  <p className="mb-2"><strong>Username:</strong> {profile.username || "N/A"}</p>
                  <p className="mb-3"><strong>Email:</strong> {profile.email || "N/A"}</p>
                </>
              )}
              <Button as={Link} to="/settings" variant="outline-primary" className="w-100">
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
