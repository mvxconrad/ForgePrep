import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button, Toast, ToastContainer } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/forgepreplogo.png";
import background from "../assets/login_background.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [showToast, setShowToast] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("https://forgeprep.net/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      setShowToast(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
        className="px-4 py-2"
        variant="dark"
      >
        <Container fluid className="d-flex justify-content-between align-items-center">
          <Navbar.Brand as={Link} to={user ? "/dashboard" : "/"}>
            <img src={logo} alt="ForgePrep Logo" height="48" />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/upload">File Upload</Nav.Link>
                  <Nav.Link as={Link} to="/testgenerator">Test Generator</Nav.Link>
                  <Nav.Link as={Link} to="/classes">Classes</Nav.Link>
                  <Nav.Link as={Link} to="/templates">Templates</Nav.Link>
                  <Nav.Link as={Link} to="/study-sets">Study Sets</Nav.Link>
                  <Nav.Link as={Link} to="/test-results">Test Results</Nav.Link>
                  <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                </>
              )}
            </Nav>

            {user ? (
              <div className="d-flex align-items-center gap-3">
                <span className="text-white fw-semibold">Hi, {user.username || "User"}</span>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Button as={Link} to="/login" variant="outline-light" size="sm">Login</Button>
                <Button as={Link} to="/register" variant="light" size="sm">Sign Up</Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2000}
          autohide
        >
          <Toast.Body className="text-white">Logout successful!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Navbar;
