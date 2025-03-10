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
        client_id: "588883044961-15sl1jthtte8vqsh2aodu7lqf16r3i55.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
      });
    };

    loadGoogleScript();
  }, []);

  const handleGoogleSignIn = async (response) => {
    const idToken = response.credential;
    console.log("Google login success:", idToken);

    try {
      const res = await fetch("http://18.221.47.222:5173/auth/google/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <div>
      <div id="g_id_onload"
        data-client_id="588883044961-15sl1jthtte8vqsh2aodu7lqf16r3i55.apps.googleusercontent.com"
        data-callback="handleGoogleSignIn"
        data-auto_prompt="false">
      </div>
      <div className="g_id_signin" data-type="standard"></div>
    </div>
  );
};

export default GoogleAuth;
