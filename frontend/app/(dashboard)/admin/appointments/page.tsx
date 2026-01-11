"use client";

import BookAppointmentModal from "@/components/appointment/BookAppointmentModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchAppointments } from "@/lib/api/appointment.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import { AppointmentResponse } from "@/types/appointment";
import { useEffect, useState } from "react";

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchAppointments()
      .then(setAppointments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Appointments" menuItems={adminMenu}>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 bg-black text-white px-4 py-2"
      >
        + Book Appointment
      </button>

      {loading && <p>Loading appointments...</p>}

      {!loading && appointments.length === 0 && <p>No appointments found.</p>}

      {!loading && appointments.length > 0 && (
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Patient Name</th>
              <th className="p-2">Doctor Name</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr className="border-b" key={appointment.id}>
                <td className="p-2">{appointment.appointmentCode}</td>
                <td className="p-2">{appointment.patientId}</td>
                <td className="p-2">{appointment.doctorId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <BookAppointmentModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchAppointments();
        }}
      />
    </DashboardLayout>
  );
};

export default AdminAppointmentsPage;
