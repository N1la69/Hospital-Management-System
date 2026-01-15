import DashboardLayout from "@/components/layout/DashboardLayout";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";

const ReceptionistDoctorsPage = () => {
  return (
    <DashboardLayout title="View Doctors" menuItems={receptionistMenu}>
      ReceptionistDoctorsPage
    </DashboardLayout>
  );
};

export default ReceptionistDoctorsPage;
