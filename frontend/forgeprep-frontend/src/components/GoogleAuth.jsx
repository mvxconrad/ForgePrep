import React, { useEffect } from "react";

const GoogleAuth = () => {
  useEffect(() => {
    const loadGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.body.appendChild(script);
      } else {
        initializeGoogleSignIn();
      }
    };

    const initializeGoogleSignIn = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // Use environment variable
        callback: handleGoogleSignIn,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async (response) => {
    const idToken = response.credential;
    console.log("Google login success:", idToken);

    try {
      const res = await fetch("https://forgeprep.net/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard"; // Redirect after login
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div>
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleAuth;
