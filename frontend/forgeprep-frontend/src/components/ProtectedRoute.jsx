import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      return Date.now() < exp * 1000;
    } catch (err) {
      console.error("Error decoding token:", err);
      return false;
    }
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
