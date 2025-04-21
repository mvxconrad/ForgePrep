import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await fetch("https://forgeprep.net/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const getActiveClass = (path) => (window.location.pathname === path ? "active" : "");

  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg" className="mb-4 custom-navbar">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/dashboard">ForgePrep</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {user ? (
              <>
                <Button as={Link} to="/dashboard" variant="outline-light" className={`me-2 ${getActiveClass("/dashboard")}`}>
                  Dashboard
                </Button>
                <Button as={Link} to="/upload" variant="outline-light" className="me-2">File Upload</Button>
                <Button as={Link} to="/testgenerator" variant="outline-light" className="me-2">Test Generator</Button>
                <Button as={Link} to="/classes" variant="outline-light" className="me-2">Classes</Button>
                <Button as={Link} to="/templates" variant="outline-light" className="me-2">Templates</Button>
                <Button as={Link} to="/study-sets" variant="outline-light" className="me-2">Study Sets</Button>
                <Button as={Link} to="/test-results" variant="outline-light" className="me-2">Test Results</Button>
                <Button as={Link} to="/profile" variant="outline-light" className="me-2">Profile</Button>
                <Button as={Link} to="/settings" variant="outline-light" className="me-2">Settings</Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="outline-light" className="me-2">Sign Up</Button>
              </>
            )}
          </Nav>
          {user && <Button variant="danger" onClick={handleLogout}>Logout</Button>}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;
