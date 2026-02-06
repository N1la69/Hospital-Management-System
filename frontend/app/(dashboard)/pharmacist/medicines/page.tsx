"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MedicineList from "@/components/pharmacy/MedicineList";
import { pharmacistMenu } from "@/lib/constants/sidebarMenus";

const PharmacistMedicinesPage = () => {
  return (
    <DashboardLayout title="Pharmacist Dashboard" menuItems={pharmacistMenu}>
      <MedicineList />
    </DashboardLayout>
  );
};

export default PharmacistMedicinesPage;
