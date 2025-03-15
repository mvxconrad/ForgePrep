import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import landingImage from "../assets/landing.jpg"; // Import an image for the landing page

const LandingPage = () => {
  return (
    <Container className="mt-4">
      <Row className="text-center">
        <Col>
          <h1>Welcome to ForgePrep</h1>
          <p>Your ultimate platform for academic success using artificial intelligence to create practice tests for any subject.</p>
        </Col>
      </Row>
      <Row className="text-center">
        <Col>
          <img src={landingImage} alt="Landing" style={{ width: "50%", height: "auto" }} /> {/* Adjusted width */}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Who We Are</Card.Title>
              <Card.Text>
                We are Maxwell Conrad, Joey Barto, and Anders Jensen, computer science and cybersecurity students at Stetson University. Our mission is to help students achieve their academic goals through innovative tools and resources.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Get Started</Card.Title>
              <Card.Text>
                Choose an option below to begin your journey with ForgePrep.
              </Card.Text>
              <Link to="/login">
                <Button variant="primary" className="me-2">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPage;

