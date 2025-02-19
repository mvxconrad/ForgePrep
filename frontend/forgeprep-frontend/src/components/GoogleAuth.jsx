import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleAuth = () => {
  const handleSuccess = (response) => {
    console.log("Google Login Success:", response);
    // Handle the response and authenticate the user
  };

  const handleFailure = (error) => {
    console.log("Google Login Failed:", error);
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={handleFailure}
    />
  );
};

export default GoogleAuth;
