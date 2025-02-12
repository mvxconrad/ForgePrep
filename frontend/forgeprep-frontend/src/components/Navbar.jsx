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
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/fileupload">File Upload</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/testgenerator">Test Generator</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/profile">Profile</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/settings">Settings</Link></li>
          </ul>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
