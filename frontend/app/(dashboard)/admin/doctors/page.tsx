"use client";

import CreateDoctorModal from "@/components/admin/CreateDoctorModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchDoctors } from "@/lib/api/doctor.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import { DoctorResponse } from "@/types/doctor";
import { useEffect, useState } from "react";

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Doctors" menuItems={adminMenu}>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 bg-black text-white px-4 py-2"
      >
        + Add Doctor
      </button>

      {loading && <p>Loading doctors...</p>}

      {!loading && doctors.length === 0 && <p>No doctors found.</p>}

      {!loading && doctors.length > 0 && (
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Specialization</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr className="border-b" key={doctor.id}>
                <td className="p-2">{doctor.doctorCode}</td>
                <td className="p-2">{doctor.fullName}</td>
                <td className="p-2">{doctor.specialization}</td>
                <td className="p-2">{doctor.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CreateDoctorModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchDoctors();
        }}
      />
    </DashboardLayout>
  );
};

export default AdminDoctorsPage;
