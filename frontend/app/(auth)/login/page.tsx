"use client";

import { loginApi } from "@/lib/api/auth.api";
import { decodeToken, getPrimaryRole } from "@/lib/auth/auth.utils";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginApi({ username, password });

      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);

      login(res.accessToken);

      document.cookie = `accessToken=${res.accessToken}; path=/`;

      const decoded = decodeToken(res.accessToken);
      const role = getPrimaryRole(decoded.roles);

      if (role === "ADMIN") window.location.href = "/admin";
      else if (role === "DOCTOR") window.location.href = "/doctor";
      else if (role === "PATIENT") window.location.href = "/patient";
      else if (role === "RECEPTIONIST") window.location.href = "/receptionist";
      else if (role === "PHARMACIST") window.location.href = "/pharmacist";
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border">
        {/* Header */}
        <div className="bg-blue-900 text-white rounded-t-xl px-6 py-4 text-center">
          <h2 className="text-lg font-semibold">Hospital Management System</h2>
          <p className="text-sm text-blue-200 mt-1">Secure Login Portal</p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full rounded-md bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition"
          >
            Login
          </button>

          <p className="text-center text-xs text-slate-500">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
