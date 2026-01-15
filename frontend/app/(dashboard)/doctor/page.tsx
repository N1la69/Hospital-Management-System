"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { fetchMyAppointments } from "@/lib/api/appointment.api";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import { formatInstantToLocalTime } from "@/lib/utils/time";
import { AppointmentResponse } from "@/types/appointment";
import { useEffect, useMemo, useState } from "react";

function toUTCDateString(iso: string) {
  const d = new Date(iso);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  ).toDateString();
}

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const todayUTC = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetchMyAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const todayAppointments = useMemo(
    () =>
      appointments.filter((a) => a.scheduledStart.slice(0, 10) === todayUTC),
    [appointments]
  );

  const stats = {
    todayAppointments: todayAppointments.length,
    totalPatients: new Set(appointments.map((a) => a.patientId)).size,
    pendingReports: 0,
    upcomingSurgeries: 0,
  };

  return (
    <DashboardLayout title="Doctor Dashboard" menuItems={doctorMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Welcome back, Doctor 👋
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s an overview of your activities today.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Today's Appointments"
          value={stats.todayAppointments}
        />
        <StatCard title="Total Patients" value={stats.totalPatients} />
        <StatCard title="Pending Reports" value={stats.pendingReports} />
        <StatCard title="Upcoming Surgeries" value={stats.upcomingSurgeries} />
      </div>

      {/* MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
          <div className="px-5 py-4 border-b">
            <h3 className="font-semibold text-slate-800">
              Today's Appointments
            </h3>
          </div>

          {loading && <p className="p-4 text-sm text-slate-500">Loading...</p>}

          {!loading && todayAppointments.length === 0 && (
            <p className="p-4 text-sm text-slate-500">No appointments today</p>
          )}

          <div className="divide-y">
            {todayAppointments.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    Patiend ID: {a.patientId}
                  </p>
                  <p className="text-slate-500">{a.status}</p>
                </div>
                <span className="text-blue-700 font-medium">
                  {formatInstantToLocalTime(a.scheduledStart)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
