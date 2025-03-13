import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <h1>Welcome</h1>
      <p>Choose an option to get started:</p>
      <div>
        <Link to="/login/">
          <button>Login</button>
        </Link>
        <Link to="/register/">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;

