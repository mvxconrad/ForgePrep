import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mock login (For testing purposes only)
    if (email === "test@example.com" && password === "password123") {
      alert("Login successful!");
      localStorage.setItem("token", "mockToken123"); // Mock token storage
      // Simulate successful login by redirecting to the dashboard or home page
      window.location.href = "/dashboard"; // Redirect to the dashboard
    } else {
      alert("Invalid credentials");
    }

    // Uncomment this part once you are ready to connect to the backend
    // try {
    //   const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
    //     email,
    //     password,
    //   });
    //   alert("Login successful!");
    //   localStorage.setItem("token", response.data.token);
    //   window.location.href = "/dashboard"; // Redirect to the dashboard
    // } catch (error) {
    //   console.error("Login failed", error);
    //   alert("Invalid credentials");
    // }
  };

  return (
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
  );
};

export default LoginPage;

