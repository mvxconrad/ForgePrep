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