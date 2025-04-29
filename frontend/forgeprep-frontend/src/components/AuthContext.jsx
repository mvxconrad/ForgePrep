import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info from backend (based on cookie)
  const fetchUser = async () => {
    try {
      const res = await fetch("https://forgeprep.net/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUser(data);
      console.log("[AuthContext] Fetched user:", data);
    } catch (err) {
      setUser(null);
      console.warn("[AuthContext] Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  // Called on mount
  useEffect(() => {
    fetchUser();
  }, []);

  // Optional: Expose manual refresh for things like "Check Again" in verify prompt
  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
