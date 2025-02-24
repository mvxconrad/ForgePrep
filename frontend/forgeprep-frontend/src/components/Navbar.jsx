import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/dashboard">ForgePrep</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/upload">File Upload</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/testgenerator">Test Generator</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/classes">Classes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/quizzes">Quizzes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/templates">Templates</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Profile</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/settings">Settings</Link>
            </li>
          </ul>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
