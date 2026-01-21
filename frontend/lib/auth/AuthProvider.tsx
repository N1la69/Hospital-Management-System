"use client";

import { ReactNode, useEffect, useState } from "react";
import { decodeToken } from "./auth.utils";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("accessToken");
    if (stored) applyToken(stored);
  }, []);

  function applyToken(token: string) {
    const decoded = decodeToken(token);

    setToken(token);
    setUserId(decoded.sub);
    setRoles(decoded.roles);

    localStorage.setItem("accessToken", token);
  }

  function login(token: string) {
    applyToken(token);
  }

  function logout() {
    setToken(null);
    setUserId(null);
    setRoles([]);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    document.cookie = "accessToken=; Max-Age=0; path=/";
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        roles,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
