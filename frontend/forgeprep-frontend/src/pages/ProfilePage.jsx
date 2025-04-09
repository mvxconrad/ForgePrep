import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("https://forgeprep.net/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Profile data fetched:", data);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to fetch profile. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  return (
    <Container className="mt-4">
      <Card className="shadow">
        <Card.Body>
          <h2>Profile</h2>
          {error && <p className="text-danger">{error}</p>}
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <Button as={Link} to="/settings" variant="primary">
            Go to Settings
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
