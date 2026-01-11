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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Doctor Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all registered doctors
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          + Add Doctor
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by doctor name, code or specialization..."
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
            🔍
          </span>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
          ⚙ Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-slate-500">Loading doctors...</div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="p-6 text-sm text-slate-500">No doctors found.</div>
        )}

        {!loading && doctors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-medium">Patient Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b last:border-b-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {doctor.doctorCode}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {doctor.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {doctor.specialization}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          doctor.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
