import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccessToken = async (code) => {
      try {
        const response = await fetch("https://forgeprep.net/auth/github/callback/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          const errorText = await response.text(); // Read the response as text
          console.error("Error response:", errorText); // Log the error response
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/dashboard/");
      } catch (err) {
        console.error("GitHub login error:", err);
        navigate("/login/");
      }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      fetchAccessToken(code);
    } else {
      navigate("/login/");
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GitHubCallback;