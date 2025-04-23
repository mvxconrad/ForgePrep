import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import api from "../util/apiService";

const SettingsPage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ error: "", success: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile({ username: res.data.username, email: res.data.email });
      } catch (err) {
        setMessage({ error: "Failed to load profile.", success: "" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage({ error: "", success: "" });

    try {
      const res = await api.put("/users/profile", { ...profile, password });
      setProfile({ username: res.data.username, email: res.data.email });
      setPassword("");
      setMessage({ success: "Profile updated successfully!", error: "" });
    } catch (err) {
      setMessage({ error: "Failed to update profile.", success: "" });
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-light" role="status" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="glassCard p-4">
        <Card.Body>
          <h3 className="fw-bold mb-4 text-white">Edit Profile</h3>
          {message.error && <Alert variant="danger">{message.error}</Alert>}
          {message.success && <Alert variant="success">{message.success}</Alert>}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="text-white">Username</Form.Label>
              <Form.Control
                type="text"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="text-white">Email</Form.Label>
              <Form.Control
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Label className="text-white">New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </Form.Group>
            <Button variant="light" type="submit" className="fw-semibold text-dark">
              Save Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;
