import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import GoogleAuth from "../components/GoogleAuth";
import FacebookAuth from "../components/FacebookAuth";
import GitHubAuth from "../components/GitHubAuth";
import loginImage from "../assets/login.png"; // Import the image

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://forgeprep.net/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Login successful, token:", data.token);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
      }}
    >
      <Row className="w-100">
        <Col lg={12} md={12}>
          <Card className="shadow mx-auto" style={{ maxWidth: "900px", width: "100%" }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <img src={loginImage} alt="Login Illustration" style={{ width: "150px" }} />
                <h1>Welcome Back to ForgePrep</h1>
                <p>Your ultimate platform for test preparation and academic success.</p>
              </div>
              <h2 className="mb-4 text-center">Login</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
              <div className="mt-3">
                <GoogleAuth />
                <FacebookAuth />
                <GitHubAuth />
              </div>
              <p className="mt-3 text-center">
                Don't have an account? <a href="/register">Sign up</a>
              </p>
              <p className="text-center">
                <a href="/forgot-password" style={{ color: "#2575fc" }}>
                  Forgot Password?
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
