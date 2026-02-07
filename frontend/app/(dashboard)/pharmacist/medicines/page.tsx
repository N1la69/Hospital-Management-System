"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MedicineList from "@/components/pharmacy/MedicineList";
import PharmacyPOS from "@/components/pharmacy/pos/PharmacyPOS";
import { PosProvider } from "@/components/pharmacy/pos/PosContext";
import { pharmacistMenu } from "@/lib/constants/sidebarMenus";

const PharmacistMedicinesPage = () => {
  return (
    <DashboardLayout title="Pharmacist Dashboard" menuItems={pharmacistMenu}>
      <PosProvider>
        <MedicineList />
        <PharmacyPOS />
      </PosProvider>
    </DashboardLayout>
  );
};

export default PharmacistMedicinesPage;
