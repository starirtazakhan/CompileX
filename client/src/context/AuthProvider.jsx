import { useEffect, useState } from "react";

import api from "../services/api";
import { AuthContext } from "./AuthContext";

const getUserFromResponse = (data) => {
  return data?.user || data?.profile || data?.data?.user || null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore existing session when the application opens
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("compilex_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const currentUser = getUserFromResponse(response.data);

        if (!currentUser) {
          throw new Error("Unable to retrieve user profile.");
        }

        setUser(currentUser);
      } catch {
        localStorage.removeItem("compilex_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const authenticate = async (endpoint, credentials) => {
    const response = await api.post(endpoint, credentials);

    const token =
      response.data?.token ||
      response.data?.data?.token;

    if (!token) {
      throw new Error("Authentication token was not returned.");
    }

    localStorage.setItem("compilex_token", token);

    let authenticatedUser = getUserFromResponse(response.data);

    // Fetch profile if login/register response doesn't contain user
    if (!authenticatedUser) {
      const profileResponse = await api.get("/auth/me");

      authenticatedUser = getUserFromResponse(profileResponse.data);
    }

    if (!authenticatedUser) {
      localStorage.removeItem("compilex_token");
      throw new Error("Unable to retrieve authenticated user.");
    }

    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const login = async (email, password) => {
    return authenticate("/auth/login", {
      email,
      password
    });
  };

  const register = async (name, email, password) => {
    return authenticate("/auth/register", {
      name,
      email,
      password
    });
  };

  const logout = () => {
    localStorage.removeItem("compilex_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}