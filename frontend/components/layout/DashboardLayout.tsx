"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

const DashboardLayout = ({ title, children }: Props) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white p-6">
        <h2 className="text-xl font-semibold mb-8">Hospital ERP</h2>
        <button
          onClick={logout}
          className="mt-auto bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 bg-slate-100">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
