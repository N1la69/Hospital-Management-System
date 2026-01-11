import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { adminMenu } from "@/lib/constants/sidebarMenus";

const AdminDashboard = () => {
  const totalDoctors = 42;
  const totalReceptionists = 12;

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={adminMenu}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        <StatCard title="Total Doctors" value={totalDoctors} />
        <StatCard title="Total Receptionists" value={totalReceptionists} />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
