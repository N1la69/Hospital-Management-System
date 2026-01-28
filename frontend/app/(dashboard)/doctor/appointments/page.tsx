"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchMyAppointments } from "@/lib/api/appointment.api";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import {
  AppointmentResponse,
  DoctorPatientRowResponse,
} from "@/types/appointment";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Section({ title, count, color, children }: any) {
  const badgeColor =
    color === "blue"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";

  return (
    <section className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${badgeColor}`}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="text-center text-sm text-slate-500 py-6">{text}</div>;
}

function AppointmentTable({ rows }: { rows: AppointmentResponse[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b text-slate-600">
          <tr>
            <th className="px-4 py-2 text-left">Patient</th>
            <th className="px-4 py-2 text-left">Appointment</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((a) => {
            const start = dayjs(a.scheduledStart);

            return (
              <tr key={a.id} className="border-b hover:bg-slate-50 transition">
                <td className="px-4 py-2 font-medium text-slate-800">
                  {a.patientName}
                </td>

                <td className="px-4 py-2 font-mono text-slate-600">
                  {a.appointmentCode}
                </td>

                <td className="px-4 py-2">{start.format("DD/MM/YYYY")}</td>

                <td className="px-4 py-2">{start.format("HH:mm")}</td>

                <td className="px-4 py-2">
                  <StatusBadge status={a.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: AppointmentResponse["status"] }) {
  const map: Record<string, string> = {
    SCHEDULED: "bg-blue-100 text-blue-700",
    CHECKED_IN: "bg-indigo-100 text-indigo-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    NO_SHOW: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        map[status]
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

const DoctorAppointmentsPage = () => {
  const [scheduled, setScheduled] = useState<AppointmentResponse[]>([]);
  const [completed, setCompleted] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAppointments = async () => {
    setLoading(true);

    try {
      const res: AppointmentResponse[] = await fetchMyAppointments();

      const upcomingStatuses = ["SCHEDULED", "CHECKED_IN", "IN_PROGRESS"];
      const pastStatuses = ["COMPLETED", "CANCELLED", "NO_SHOW"];

      setScheduled(res.filter((a) => upcomingStatuses.includes(a.status)));
      setCompleted(res.filter((a) => pastStatuses.includes(a.status)));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch your appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  return (
    <DashboardLayout title="Doctor Dashboard" menuItems={doctorMenu}>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Appointment Overview
          </h2>
          <p className="text-sm text-slate-500">
            Manage your upcoming and past consultations
          </p>
        </div>

        {loading && (
          <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
            Loading appointments...
          </div>
        )}

        {/* UPCOMING */}
        <Section
          title="Upcoming Appointments"
          count={scheduled.length}
          color="blue"
        >
          {scheduled.length === 0 ? (
            <Empty text="No upcoming appointments." />
          ) : (
            <AppointmentTable rows={scheduled} />
          )}
        </Section>

        {/* PAST */}
        <Section
          title="Past Appointments"
          count={completed.length}
          color="green"
        >
          {completed.length === 0 ? (
            <Empty text="No past appointments found." />
          ) : (
            <AppointmentTable rows={completed} />
          )}
        </Section>
      </div>
    </DashboardLayout>
  );
};

export default DoctorAppointmentsPage;
