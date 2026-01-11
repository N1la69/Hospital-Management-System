"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { fetchAdminStats } from "@/lib/api/stats.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import { AdminStats } from "@/types/stats";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(console.error);
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={adminMenu}>
      {!stats ? (
        <p>Loading Stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
          <StatCard title="Total Doctors" value={stats?.doctorsCount} />
          <StatCard
            title="Total Receptionists"
            value={stats?.receptionistsCount}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
