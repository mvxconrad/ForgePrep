import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
{/*import GoogleAuth from "../components/GoogleAuth";
import FacebookAuth from "../components/FacebookAuth";
import GitHubAuth from "../components/GitHubAuth"; */}

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://18.221.47.222:8000/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid credentials");

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleLogin}>
        {/*<input type="username" className="form-control mb-2" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />*/}
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {/*
      <div className="mt-3">
        <GoogleAuth />
        <FacebookAuth />
        <GitHubAuth />
      </div>
      */}
      <p className="mt-2">Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  );
};

export default LoginPage;
