import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

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

        const response = await fetch("https://forgeprep.net/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.username || !data.email) {
          throw new Error("Incomplete profile data received.");
        }

        console.log("Profile data fetched:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
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
  );
};

export default ProfilePage;
