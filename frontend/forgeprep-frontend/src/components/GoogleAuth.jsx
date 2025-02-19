import React, { useEffect } from "react";

const GoogleAuth = () => {
  useEffect(() => {
    const initializeGoogleSignIn = () => {
      window.gapi.load("auth2", () => {
        window.gapi.auth2.init({
          client_id: "588883044961-15sl1jthtte8vqsh2aodu7lqf16r3i55.apps.googleusercontent.com",
        });
      });
    };

    initializeGoogleSignIn();
  }, []);

  const handleGoogleSignIn = async () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const idToken = googleUser.getAuthResponse().id_token;
    console.log("Google login success:", idToken);
    // Send the idToken to your backend for verification and authentication
    try {
      const response = await fetch("http://18.221.47.222:8000/google/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Google login failed");

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google login error:", err);
    }
  };

  return (
    <button onClick={handleGoogleSignIn} className="btn btn-danger w-100 mt-2">
      Login with Google
    </button>
  );
};

export default GoogleAuth;
