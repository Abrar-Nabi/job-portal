import { jwtDecode } from "jwt-decode";

// Save token and user info in localStorage
export const saveToken = (token, role, name, email) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("name", name);
  localStorage.setItem("email", email);
};

// Remove token and user info from localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
};

// Get user info from localStorage and check token expiration
export const getUserInfo = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token); // Decode the token to check expiration
    const isExpired = decoded.exp * 1000 < Date.now(); // Check if token is expired
    if (isExpired) {
      removeToken(); // Remove token if expired
      return null;
    }

    return {
      token: localStorage.getItem("token"),
      role: localStorage.getItem("role"),
      name: localStorage.getItem("name"),
      email: localStorage.getItem("email"),
    };
  } catch (error) {
    removeToken(); // In case of an invalid or malformed token
    return null;
  }
};

// Get token from localStorage (without checking expiration)
export const getToken = () => {
  return localStorage.getItem("token");
};
