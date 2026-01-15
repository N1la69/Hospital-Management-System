import DashboardLayout from "@/components/layout/DashboardLayout";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";

const ReceptionistDashboard = () => {
  return (
    <DashboardLayout
      title="Receptionist Dashboard"
      menuItems={receptionistMenu}
    >
      <p>Welcome, Receptionist 👋</p>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
