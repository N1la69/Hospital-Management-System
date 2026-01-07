"use client";

import { loginApi } from "@/lib/api/auth.api";
import { decodeToken, getPrimaryRole } from "@/lib/auth/auth.utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginApi({ username, password });
    login(res.accessToken);

    document.cookie = `accessToken=${res.accessToken}; path=/`;

    const decoded = decodeToken(res.accessToken);
    const role = getPrimaryRole(decoded.roles);

    if (role === "ADMIN") window.location.href = "/admin";
    else if (role === "DOCTOR") window.location.href = "/doctor";
    else if (role === "PATIENT") window.location.href = "/patient";
    else if (role === "RECEPTIONIST") window.location.href = "/receptionist";
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-80 space-y-4">
        <input
          type="text"
          className="w-full border p-2"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full border p-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-black text-white p-2"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
