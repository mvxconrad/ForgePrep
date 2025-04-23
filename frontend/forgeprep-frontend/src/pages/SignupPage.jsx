import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import background1 from "../assets/signup_background.png";
import logo from "../assets/forgepreplogo.png";
import signupImage from "../assets/signupicon.png";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://forgeprep.net/api/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Signup failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="position-relative bg-dark text-light overflow-hidden" style={{ minHeight: "100vh" }}>
      {/* Background Image */}
      <img
        src={background1}
        alt="Signup Background"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ opacity: 0.25, zIndex: 0 }}
      />

      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark px-4 py-2 position-fixed w-100"
        style={{ zIndex: 10, backgroundColor: "rgba(13, 17, 23, 0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="ForgePrep Logo" height="64" />
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm">
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Signup Form Section */}
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", zIndex: 2, position: "relative", paddingTop: "80px" }}
      >
        <Row className="w-100">
          <Col lg={12} md={12}>
            <Card className="glass mx-auto" style={{ maxWidth: "900px", width: "100%" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img src={signupImage} alt="Signup Illustration" style={{ width: "150px" }} />
                  <h1 className="text-white">Join ForgePrep Today</h1>
                  <p className="text-white-50">Start your journey to academic success with us.</p>
                </div>
                <h2 className="mb-4 text-center text-white">Sign Up</h2>
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                <Form onSubmit={handleSignup}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label className="text-white">Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label className="text-white">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label className="text-white">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="light" type="submit" className="w-100 text-dark fw-semibold">
                    Sign Up
                  </Button>
                </Form>
                <p className="mt-3 text-center">
                  Already have an account? <a href="/login" className="text-info">Login</a>
                </p>

                {/* Future social auth buttons */}
                {/**
                <Button variant="outline-light" className="w-100 mt-2">
                  Sign up with Google
                </Button>
                <Button variant="outline-light" className="w-100 mt-2">
                  Sign up with Facebook
                </Button>
                **/}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignupPage;