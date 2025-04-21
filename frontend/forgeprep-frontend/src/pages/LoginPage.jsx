import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import background1 from "../assets/login_background.png";
import logo from "../assets/forgepreplogo.png";
import loginImage from "../assets/loginicon.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://forgeprep.net/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="position-relative bg-dark text-light overflow-hidden" style={{ minHeight: "100vh" }}>
      <img
        src={background1}
        alt="Login Background"
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ opacity: 0.25, zIndex: 0 }}
      />

      <nav
        className="navbar navbar-expand-lg navbar-dark px-4 py-2 position-fixed w-100"
        style={{ zIndex: 10, backgroundColor: "rgba(13, 17, 23, 0.85)", backdropFilter: "blur(12px)" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="ForgePrep Logo" height="64" />
          </Link>
          <div className="d-flex gap-2">
            <Link to="/register" className="btn btn-outline-light btn-sm">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", zIndex: 2, position: "relative", paddingTop: "80px" }}
      >
        <Row className="w-100">
          <Col lg={12} md={12}>
            <Card className="glass mx-auto" style={{ maxWidth: "900px", width: "100%" }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <img src={loginImage} alt="Login Illustration" style={{ width: "150px" }} />
                  <h1 className="text-white">Welcome Back to ForgePrep</h1>
                  <p className="text-white-50">Your ultimate platform for test preparation and academic success.</p>
                </div>
                <h2 className="mb-4 text-center text-white">Login</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <Form onSubmit={handleLogin}>
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
                    Login
                  </Button>
                </Form>
                <p className="mt-3 text-center">
                  Don't have an account? <Link to="/register" className="text-info">Sign up</Link>
                </p>
                <p className="text-center">
                  <Link to="/forgot-password" className="text-info">Forgot Password?</Link>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
