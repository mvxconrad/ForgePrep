import React, { useState } from "react";
import { Container, Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import api from "../util/apiService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password/", { email });
      setSent(true);
    } catch (err) {
      console.error("Forgot password failed:", err);
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark text-light" style={{ minHeight: "100vh", paddingTop: "100px" }}>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="p-4 shadow-lg glass text-light" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="fw-bold text-center mb-3">🔐 Forgot Password?</h3>
          <p className="text-center mb-4 text-muted">
            Enter your email and we’ll send you a reset link.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {sent && (
            <Alert variant="success">
              ✅ If the email exists, we’ve sent a reset link. Please check your inbox.
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              type="submit"
              variant="light"
              className="w-100 fw-bold text-dark"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default ForgotPasswordPage;
