"use client";

import BookAppointmentModal from "@/components/appointment/BookAppointmentModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  fetchAppointments,
  searchAppointments,
} from "@/lib/api/appointment.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import {
  AppointmentResponse,
  AppointmentSearchFilter,
} from "@/types/appointment";
import { useEffect, useState } from "react";

const AdminAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<AppointmentSearchFilter>({});

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  function timeToInstant(time: string, baseDateISO: string) {
    const base = new Date(baseDateISO);
    const [h, m] = time.split(":").map(Number);

    const localDateTime = new Date(
      base.getFullYear(),
      base.getMonth(),
      base.getDate(),
      h,
      m,
      0,
      0
    );

    return localDateTime.toISOString();
  }

  const loadAllAppointments = () => {
    handleSearch(0);
  };

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);
    const payload: AppointmentSearchFilter = { ...filters };

    try {
      if (searchText) {
        payload.appointmentCode = searchText;
      }

      const baseDate = filters.date ?? new Date().toISOString();

      if (filters.fromTime)
        payload.fromTime = timeToInstant(filters.fromTime, baseDate);

      if (filters.toTime)
        payload.toTime = timeToInstant(filters.toTime, baseDate);

      console.log("Appointment Search FromTime:", payload.fromTime);
      console.log("Appointment Search ToTime:", payload.toTime);

      const result = await searchAppointments(payload, pageNo, pageSize);

      setAppointments(result.items);
      setTotal(result.total);
      setPage(pageNo);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    handleSearch(0);
  };

  useEffect(() => {
    loadAllAppointments();
  }, []);

  return (
    <DashboardLayout title="Appointments" menuItems={adminMenu}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Appointment Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all appointments
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          + Book Appointment
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by appointment code..."
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
            🔍
          </span>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          ⚙ Filters
        </button>

        <button
          onClick={() => handleSearch()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white border rounded-xl p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Filter Appointments</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="Patient Name"
              onChange={(e) =>
                setFilters({ ...filters, patientName: e.target.value })
              }
              className="border px-3 py-2 rounded text-sm"
            />

            <input
              placeholder="Doctor Name"
              onChange={(e) =>
                setFilters({ ...filters, doctorName: e.target.value })
              }
              className="border px-3 py-2 rounded text-sm"
            />

            <select
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value as any })
              }
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="">Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <select
              onChange={(e) =>
                setFilters({ ...filters, day: e.target.value as any })
              }
              className="border px-3 py-2 rounded text-sm"
            >
              <option value="">Day</option>
              <option value="MONDAY">Monday</option>
              <option value="TUESDAY">Tuesday</option>
              <option value="WEDNESDAY">Wednesday</option>
              <option value="THURSDAY">Thursday</option>
              <option value="FRIDAY">Friday</option>
              <option value="SATURDAY">Saturday</option>
              <option value="SUNDAY">Sunday</option>
            </select>

            <input
              type="date"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  date: new Date(e.target.value).toISOString(),
                })
              }
              className="border px-3 py-2 rounded text-sm"
            />

            <input
              type="time"
              onChange={(e) =>
                setFilters({ ...filters, fromTime: e.target.value })
              }
              className="border px-3 py-2 rounded text-sm"
            />

            <input
              type="time"
              onChange={(e) =>
                setFilters({ ...filters, toTime: e.target.value })
              }
              className="border px-3 py-2 rounded text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={clearFilters}
              className="border px-4 py-2 rounded text-sm"
            >
              Clear
            </button>

            <button
              onClick={() => handleSearch(0)}
              className="bg-blue-700 text-white px-5 py-2 rounded text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

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

      {/* PAGINATION */}
      {Math.ceil(total / pageSize) > 1 && (
        <div className="flex justify-between mt-4 text-sm">
          <span>
            Page {page + 1} of {Math.ceil(total / pageSize)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => handleSearch(page - 1)}
              className="border px-3 py-1 rounded"
            >
              Prev
            </button>

            <button
              disabled={(page + 1) * pageSize >= total}
              onClick={() => handleSearch(page + 1)}
              className="border px-3 py-1 rounded"
            >
              Next
            </button>
          </div>
        </div>
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
