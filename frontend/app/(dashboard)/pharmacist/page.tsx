"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AlertsPanel from "@/components/pharmacy/AlertsPanel";
import MedicineList from "@/components/pharmacy/MedicineList";
import { pharmacistMenu } from "@/lib/constants/sidebarMenus";

const PharmacistDashboard = () => {
  return (
    <DashboardLayout title="Pharmacist Dashboard" menuItems={pharmacistMenu}>
      <div className="space-y-6">
        <AlertsPanel />

        <MedicineList />
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;
