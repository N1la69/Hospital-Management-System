"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchDoctors } from "@/lib/api/doctor.api";
import { DoctorResponse } from "@/types/doctor";
import { useEffect, useState } from "react";

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Doctors">
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
    </DashboardLayout>
  );
};

export default AdminDoctorsPage;
