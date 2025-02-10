import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Hook to navigate between pages

  const handleLogin = async (e) => {
    e.preventDefault();

    // TEMPORARY: Allow login with hardcoded test credentials
    if (email === "test@example.com" && password === "password") {
      localStorage.setItem("token", "fake-token"); // Store fake token
      navigate("/dashboard"); // Redirect to dashboard
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        { email, password }
      );

      alert("Login successful!");
      localStorage.setItem("token", response.data.token); // Store real token
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.error("Login failed", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

