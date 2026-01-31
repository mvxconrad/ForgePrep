import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert
} from "react-bootstrap";
import AppNavbar from "../components/AppNavbar";
import background1 from "../assets/login_background.png";
import logo from "../assets/forgepreplogo.png";
import loginImage from "../assets/loginicon.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setMessage("");

    try {
      const response = await fetch("https://forgeprep.net/api/auth/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to send reset email.");
      }

      const data = await response.json();
      setStatus("success");
      setMessage(data.message || "Password reset link sent successfully.");
    } catch (err) {
      console.error("Reset error:", err);
      setStatus("error");
      setMessage("Could not send reset link. Please try again.");
    }
  };

  return (
    <div
      className="position-relative bg-dark text-light overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background Image */}
      <img
        src={background1}
        alt="Forgot Password Background"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ opacity: 0.25, zIndex: 0, pointerEvents: "none" }}
      />

      {/* Navbar */}
      <AppNavbar />

      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", zIndex: 2, position: "relative", paddingTop: "80px" }}
      >
        <Row className="w-100">
          <Col lg={12} md={12}>
            <Card className="glass mx-auto" style={{ maxWidth: "900px", width: "100%" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img src={loginImage} alt="Forgot Illustration" style={{ width: "150px" }} />
                  <h1 className="text-white">Forgot Your Password?</h1>
                  <p className="text-white-50">
                    Enter your email and we’ll send you a link to reset your password.
                  </p>
                </div>

                {status && (
                  <Alert variant={status === "success" ? "success" : "danger"} className="text-center">
                    {message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-white">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Button variant="light" type="submit" className="w-100 text-dark fw-semibold">
                    Send Reset Link
                  </Button>
                </Form>

                <p className="mt-4 text-center">
                  <Link to="/login" className="text-info">Back to Login</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
