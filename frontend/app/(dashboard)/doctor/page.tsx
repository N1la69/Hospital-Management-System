"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import { fetchMyAppointments } from "@/lib/api/appointment.api";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import {
  formatInstantToLocalTime,
  getLocalDateStringFromInstant,
} from "@/lib/utils/time";
import { AppointmentResponse } from "@/types/appointment";
import { useEffect, useMemo, useState } from "react";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"today" | "upcoming">("today");

  const todayLocal = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  useEffect(() => {
    fetchMyAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const todayAppointments = useMemo(
    () =>
      appointments.filter(
        (a) => getLocalDateStringFromInstant(a.scheduledStart) === todayLocal,
      ),
    [appointments, todayLocal],
  );

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments.filter((a) => new Date(a.scheduledStart) > now);
  }, [appointments]);

  const displayedAppointments =
    view === "today" ? todayAppointments : upcomingAppointments;

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
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">
                {view === "today"
                  ? "Today's Appointments"
                  : "Upcoming Appointments"}
              </h3>

              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => setView("today")}
                  className={`px-3 py-1 rounded-md border ${
                    view === "today"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Today
                </button>

                <button
                  onClick={() => setView("upcoming")}
                  className={`px-3 py-1 rounded-md border ${
                    view === "upcoming"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Upcoming
                </button>
              </div>
            </div>
          </div>

          {loading && <p className="p-4 text-sm text-slate-500">Loading...</p>}

          {!loading && displayedAppointments.length === 0 && (
            <p className="p-4 text-sm text-slate-500">
              {view === "today"
                ? "No appointments today"
                : "No upcoming appointments"}
            </p>
          )}

          <div className="divide-y">
            {displayedAppointments.map((a, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div className="space-y-1">
                  <p className="font-medium text-base text-slate-800">
                    Patient Name: {a.patientName}
                  </p>
                  <p className="font-medium text-slate-700">
                    Date:{" "}
                    {new Date(a.scheduledStart).toLocaleDateString("en-GB")}
                  </p>
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
