import DashboardLayout from "@/components/layout/DashboardLayout";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";

const ReceptionistPatientPage = () => {
  return (
    <DashboardLayout title="Patient Utilities" menuItems={receptionistMenu}>
      ReceptionistPatientPage
    </DashboardLayout>
  );
};

export default ReceptionistPatientPage;
