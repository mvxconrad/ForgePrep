import React, { useEffect } from "react";

const FacebookAuth = () => {
  useEffect(() => {
    const loadFacebookSDK = () => {
      if (window.FB) return;

      window.fbAsyncInit = function () {
        window.FB.init({
          appId: import.meta.env.VITE_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: "v12.0",
        });
      };

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;

      document.body.appendChild(script);
    };

    loadFacebookSDK();
  }, []);

  const handleFacebookSignIn = () => {
    if (!window.FB) {
      console.error("Facebook SDK not loaded");
      return;
    }

    window.FB.login(
      async (response) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          try {
            const res = await fetch("https://forgeprep.net/api/auth/facebook", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: accessToken }),
              credentials: "include", // Ensure cookie is accepted
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Facebook login failed");

           
            window.location.href = "/dashboard";
          } catch (err) {
            console.error("Facebook login error:", err);
          }
        } else {
          console.log("User cancelled login or did not fully authorize.");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <button onClick={handleFacebookSignIn} className="btn btn-primary w-100 mt-2">
      Login with Facebook
    </button>
  );
};

export default FacebookAuth;
