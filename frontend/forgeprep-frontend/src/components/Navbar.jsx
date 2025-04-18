import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar as BootstrapNavbar, Nav, Container, Button } from "react-bootstrap";
import { getUserRole } from "../utils/authUtils";

const CustomNavbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");
  const role = getUserRole();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      navigate("/login");
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
            {/* Guest Links */}
            {role === "guest" && (
              <>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="outline-light" className="me-2">Sign Up</Button>
              </>
            )}

            {/* User Links */}
            {(role === "user" || role === "admin") && (
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
            )}

            {/* Admin Links */}
            {role === "admin" && (
              <>
                <Button as={Link} to="/admin-dashboard" variant="outline-light" className={`me-2 ${getActiveClass("/admin-dashboard")}`}>
                  Admin Dashboard
                </Button>
                <Button as={Link} to="/admin-analytics" variant="outline-light" className={`me-2 ${getActiveClass("/admin-analytics")}`}>
                  Admin Analytics
                </Button>
                <Button as={Link} to="/ai-test-insights" variant="outline-light" className={`me-2 ${getActiveClass("/ai-test-insights")}`}>
                  AI Test Insights
                </Button>
              </>
            )}
          </Nav>
          {isAuthenticated && <Button variant="danger" onClick={handleLogout}>Logout</Button>}
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;
