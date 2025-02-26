import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const CustomNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/dashboard">ForgePrep</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Button as={Link} to="/dashboard" variant="outline-light" className="me-2">Dashboard</Button>
            <Button as={Link} to="/upload" variant="outline-light" className="me-2">File Upload</Button>
            <Button as={Link} to="/testgenerator" variant="outline-light" className="me-2">Test Generator</Button>
            <Button as={Link} to="/classes" variant="outline-light" className="me-2">Classes</Button>
            <Button as={Link} to="/quizzes" variant="outline-light" className="me-2">Quizzes</Button>
            <Button as={Link} to="/templates" variant="outline-light" className="me-2">Templates</Button>
            <Button as={Link} to="/profile" variant="outline-light" className="me-2">Profile</Button>
            <Button as={Link} to="/settings" variant="outline-light" className="me-2">Settings</Button>
          </Nav>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
