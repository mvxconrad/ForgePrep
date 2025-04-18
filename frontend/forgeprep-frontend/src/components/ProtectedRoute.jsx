import React from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../utils/authUtils";

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const role = getUserRole();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={role === "guest" ? "/login" : "/dashboard"} />;
  }

  return <Component />;
};

export default ProtectedRoute;
