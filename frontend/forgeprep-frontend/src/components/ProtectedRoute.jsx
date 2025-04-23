import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("https://forgeprep.net/api/auth/me", {
          credentials: "include",
        });
        setAuthenticated(res.ok);
      } catch {
        setAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) return null; // or a loading spinner
  return authenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
