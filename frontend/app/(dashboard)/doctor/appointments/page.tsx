"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { doctorMenu } from "@/lib/constants/sidebarMenus";

const DoctorAppointmentsPage = () => {
  return (
    <DashboardLayout title="Doctor Dashboard" menuItems={doctorMenu}>
      DoctorAppointmentsPage
    </DashboardLayout>
  );
};

export default DoctorAppointmentsPage;
