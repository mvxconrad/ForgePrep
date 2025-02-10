import React, { useState } from "react";
import axios from "axios";

const SettingsPage = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/update-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password", error);
      setMessage("Failed to update password.");
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SettingsPage;

