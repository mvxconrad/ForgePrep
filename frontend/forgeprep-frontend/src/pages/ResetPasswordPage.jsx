import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import api from "../util/apiService";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing token.");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/reset-password/", {
        token,
        new_password: newPassword,
      });
      setSuccess(res.data.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Reset failed:", err);
      setError(err.response?.data?.detail || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark text-light" style={{ minHeight: "100vh", paddingTop: "100px" }}>
      <Container className="d-flex justify-content-center align-items-center">
        <Card className="p-4 shadow-lg glass text-light" style={{ maxWidth: "500px", width: "100%" }}>
          <h3 className="fw-bold text-center mb-3">🔐 Reset Your Password</h3>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
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
                  <Spinner animation="border" size="sm" className="me-2" /> Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default ResetPasswordPage;
