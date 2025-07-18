// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component wraps your app and provides auth data/functions
export const AuthProvider = ({ children }) => {
  // Load user from localStorage (or null if not logged in)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load token from localStorage (or null)
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // login function to store user and token in state and localStorage
  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
  };

  // logout function to clear user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Provide user, token, and auth functions to children components
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
