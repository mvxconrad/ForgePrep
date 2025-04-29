// src/pages/VerifyEmailPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../util/apiService";
import { Container, Spinner, Alert, Button } from "react-bootstrap";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch (err) {
        console.error("Verification failed:", err);
        setStatus("error");
      }
    };
    verifyEmail();
  }, [searchParams]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  return (
    <Container className="text-center text-light py-5">
      {status === "verifying" && (
        <>
          <Spinner animation="border" />
          <h4 className="mt-3">Verifying your email...</h4>
        </>
      )}
      {status === "success" && (
        <>
          <Alert variant="success">
            ✅ Email verified successfully! You can now log in.
          </Alert>
          <Button variant="light" onClick={handleGoToLogin}>
            Go to Login
          </Button>
        </>
      )}
      {status === "error" && (
        <>
          <Alert variant="danger">
            ❌ Verification failed. Please check your link or try again.
          </Alert>
          <Button variant="light" onClick={handleGoToLogin}>
            Back to Login
          </Button>
        </>
      )}
    </Container>
  );
};

export default VerifyEmailPage;
