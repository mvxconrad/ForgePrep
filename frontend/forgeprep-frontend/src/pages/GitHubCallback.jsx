import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GitHubCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        const response = await fetch("https://forgeprep.net/auth/github/callback/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/dashboard/");
      } catch (err) {
        console.error("GitHub login error:", err);
        setError(err.message || "An error occurred during login.");
        navigate("/login/");
      } finally {
        setLoading(false); // Stop loading after the process finishes
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code);
    } else {
      setError("Authorization code not found.");
      setLoading(false);
      navigate("/login/");
    }
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null; // You don't need anything here since loading or error is handled
};

export default GitHubCallback;
