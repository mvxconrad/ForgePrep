import React, { useState, useContext } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../util/apiService";
import { AuthContext } from "../components/AuthContext";

const VerifyEmailPrompt = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useContext(AuthContext);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleCheckAgain = async () => {
    try {
      const refreshed = await refreshUser();
      if (refreshed?.is_verified) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Check again failed:", err);
    }
  };

  const handleResend = async () => {
    setSending(true);
    setError("");
  
    if (!user?.email) {
      setError("User email is not available. Please log in again.");
      setSending(false);
      return;
    }
  
    try {
      await api.post("/auth/resend-verification", {
        email: user.email,
      });
      setSent(true);
    } catch (err) {
      console.error("Resend failed:", err);
      setError("Failed to resend verification email.");
    } finally {
      setSending(false);
    }
  };
  

  return (
    <Container className="text-center text-light py-5">
      <h2 className="fw-bold mb-3">📧 Please Verify Your Email</h2>
      <p className="mb-4">
        We’ve sent a confirmation link to your email. You must verify it to access your account.
      </p>

      {sent && (
        <Alert variant="success" className="w-50 mx-auto">
          ✅ Verification email sent again! Check your inbox.
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="w-50 mx-auto">
          {error}
        </Alert>
      )}

      <div className="d-flex justify-content-center gap-3">
        <Button variant="light" className="fw-semibold" onClick={handleCheckAgain}>
          Check Again
        </Button>

        <Button
          variant="outline-info"
          className="fw-semibold"
          onClick={handleResend}
          disabled={sending || sent}
        >
          {sending ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Sending...
            </>
          ) : (
            "Resend Email"
          )}
        </Button>
      </div>
    </Container>
  );
};

export default VerifyEmailPrompt;
