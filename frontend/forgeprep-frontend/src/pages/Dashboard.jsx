import React from "react";
import { Container, Row, Col, Card, Navbar, Nav } from "react-bootstrap";
import PerformanceChart from "../components/PerformanceChart";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const mockPerformanceData = {
    dates: ["Jan", "Feb", "Mar"],
    correct: [5, 7, 8],
    incorrect: [2, 3, 1],
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/dashboard">ForgePrep</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/upload">File Upload</Nav.Link>
              <Nav.Link as={Link} to="/testgenerator">Test Generator</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Dashboard Content */}
      <Container className="mt-4">
        <h1 className="mb-4">Dashboard</h1>

        {/* Stats Section */}
        <Row>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Tests Taken</Card.Title>
                <Card.Text>15</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Correct Answers</Card.Title>
                <Card.Text>75%</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Incorrect Answers</Card.Title>
                <Card.Text>25%</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Performance Chart */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Performance Over Time</Card.Title>
                <PerformanceChart performanceData={mockPerformanceData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
