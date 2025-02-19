import React, { useEffect } from "react";

const FacebookAuth = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "981364820569168", // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });
    };

    // Load the Facebook SDK script
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleFacebookSignIn = async () => {
    window.FB.login(
      async function (response) {
        if (response.authResponse) {
          console.log("Facebook login success:", response);
          // Send the access token to your backend for verification and authentication
          const accessToken = response.authResponse.accessToken;
          try {
            const res = await fetch("http://18.221.47.222:8000/facebook/callback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token: accessToken }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Facebook login failed");

            localStorage.setItem("token", data.token);
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
