import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        const response = await fetch("http://18.221.47.222:8000/github/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "GitHub login failed");

        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } catch (err) {
        console.error("GitHub login error:", err);
        navigate("/login");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      fetchAccessToken(code);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GitHubCallback;