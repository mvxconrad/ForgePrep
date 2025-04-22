import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/apiService"; // Import the centralized API service
import PageWrapper from "../components/PageWrapper"; // Import PageWrapper

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing. Please log in again.");
        }

        const response = await api.get("/users/");
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err.response?.data || err.message);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          setError("Failed to fetch profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <Container className="mt-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <Container className="mt-4 text-center">
          <p className="text-danger">{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container className="mt-4">
        <Card className="shadow">
          <Card.Body>
            <h2>Profile</h2>
            {error && <p className="text-danger">{error}</p>}
            <p><strong>Username:</strong> {profile.username || "N/A"}</p>
            <p><strong>Email:</strong> {profile.email || "N/A"}</p>
            <Button as={Link} to="/settings" variant="primary">
              Go to Settings
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default ProfilePage;
