// components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  console.log("[ProtectedRoute] loading:", loading, "user:", user);

  if (loading) return <div className="text-center text-white">Checking authentication...</div>;

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
