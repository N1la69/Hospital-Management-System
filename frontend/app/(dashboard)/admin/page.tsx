import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-4">
        <Link
          href="/admin/patients"
          className="block p-4 bg-white rounded shadow"
        >
          Manage Patients
        </Link>
        <Link
          href="/admin/doctors"
          className="block p-4 bg-white rounded shadow"
        >
          Manage Doctors
        </Link>
        <Link
          href="/admin/receptionists"
          className="block p-4 bg-white rounded shadow"
        >
          Manage Receptionists
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
