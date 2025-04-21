export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return "guest"; // Default to "guest" if no token is present

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
    return payload.role || "user"; // Default to "user" if no role is specified
  } catch (err) {
    console.error("Error decoding token:", err);
    return "guest"; // Fallback to "guest" on error
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  const { exp } = JSON.parse(atob(token.split(".")[1]));
  return Date.now() < exp * 1000;
};