"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

export interface SidebarItem {
  label: string;
  href: string;
}

interface Props {
  title: string;
  children: ReactNode;
  menuItems?: SidebarItem[];
}

const DashboardLayout = ({ title, children, menuItems = [] }: Props) => {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static z-50 md:z-auto top-0 left-0 h-screen md:h-screen w-64 bg-blue-900 text-white flex flex-col
                    transform transition-transform duration-300 ${
                      mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full md:translate-x-0"
                    }
                  `}
      >
        <div className="p-6 border-b border-blue-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Hospital ERP</h2>
            <p className="text-xs text-blue-200 mt-1">Dashboard</p>

            <button
              className="md:hidden text-white text-xl"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-white text-blue-900 font-semibold"
                    : "text-blue-100 hover:bg-blue-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* MOBILE TOP BAR */}
        <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-blue-900 text-xl"
          >
            ☰
          </button>
          <span className="font-semibold text-slate-800">{title}</span>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <h1 className="hidden md:block text-2xl font-semibold text-slate-800 mb-6">
            {title}
          </h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
