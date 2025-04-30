import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "100vh" }}>
        <span className="spinner-border text-light me-2" role="status" /> Checking credentials...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // ✅ Redirect unverified users to verification prompt. Commented out for now.
  // if (!user.is_verified) return <Navigate to="/verify-email-prompt" replace />;

  return children;
};

export default ProtectedRoute;
