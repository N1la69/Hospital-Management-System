import DashboardLayout from "@/components/layout/DashboardLayout";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";

const ReceptionistAppointmentPage = () => {
  return (
    <DashboardLayout title="Manage Appointments" menuItems={receptionistMenu}>
      ReceptionistAppointmentPage
    </DashboardLayout>
  );
};

export default ReceptionistAppointmentPage;
