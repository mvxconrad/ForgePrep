import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar as BootstrapNavbar,
  Nav,
  Container,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { AuthContext } from "../components/AuthContext";
import logo from "../assets/forgepreplogo.png";
import background from "../assets/login_background.png";

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <BootstrapNavbar
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
          <BootstrapNavbar.Brand as={Link} to={user ? "/dashboard" : "/"}>
            <img src={logo} alt="ForgePrep Logo" height="48" />
          </BootstrapNavbar.Brand>

          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />

          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {user && (
                <>
                  <Nav.Link as={Link} to="/dashboard" active={isActive("/dashboard")}>Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/upload" active={isActive("/upload")}>File Upload</Nav.Link>
                  <Nav.Link as={Link} to="/testgenerator" active={isActive("/testgenerator")}>Test Generator</Nav.Link>
                  <Nav.Link as={Link} to="/classes" active={isActive("/classes")}>Classes</Nav.Link>
                  <Nav.Link as={Link} to="/templates" active={isActive("/templates")}>Templates</Nav.Link>
                  <Nav.Link as={Link} to="/study-sets" active={isActive("/study-sets")}>Study Sets</Nav.Link>
                  <Nav.Link as={Link} to="/test-results" active={isActive("/test-results")}>Test Results</Nav.Link>
                  <Nav.Link as={Link} to="/profile" active={isActive("/profile")}>Profile</Nav.Link>
                  <Nav.Link as={Link} to="/settings" active={isActive("/settings")}>Settings</Nav.Link>
                </>
              )}
            </Nav>

            {user ? (
              <div className="d-flex flex-wrap align-items-center gap-3 mt-2 mt-lg-0">
                <span className="text-white fw-semibold">
                  {user?.username ? `Hi, ${user.username}` : "Welcome"}
                </span>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="d-flex gap-2 mt-2 mt-lg-0">
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light" size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

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

export default AppNavbar;
