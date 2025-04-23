import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";
import api from "../util/apiService";
import styles from "./Dashboard.module.css";
import backgroundImage from "../assets/background_abstract2.png";

const SettingsPage = () => {
  const [profile, setProfile] = useState({ username: "", email: "" });
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ error: "", success: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setProfile(res.data);
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
      const res = await api.put("/users/profile", {
        username: profile.username,
        email: profile.email,
        ...(password && { password })
      });
      setProfile(res.data);
      setPassword("");
      setMessage({ success: "Profile updated successfully.", error: "" });
    } catch (err) {
      const msg = err?.response?.data?.detail?.[0]?.msg || "Failed to update profile.";
      setMessage({ error: msg, success: "" });
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
          <Col lg={6} md={8}>
            <Card className={`${styles.glassCard} border-0 shadow p-4`}>
              <Card.Body>
                <h3 className="text-white mb-4 fw-bold text-center">Account Settings</h3>

                {message.error && <Alert variant="danger">{message.error}</Alert>}
                {message.success && <Alert variant="success">{message.success}</Alert>}

                <Form onSubmit={handleUpdate}>
                  <h5 className="text-light mb-3">Account Info</h5>
                  <hr className="mb-4 border-secondary" />

                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="text-white fw-semibold">Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      required
                      className={styles.glassInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-white fw-semibold">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                      className={styles.glassInput}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formPassword">
                    <Form.Label className="text-white fw-semibold">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.glassInput}
                    />
                  </Form.Group>

                  <Button type="submit" variant="light" className="w-100 text-dark fw-semibold">
                    Save Changes
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Button variant="outline-danger" size="sm" disabled>
                Delete Account (Coming Soon)
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
