"use client";

import BookAppointmentModal from "@/components/appointment/BookAppointmentModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { searchAppointments } from "@/lib/api/appointment.api";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";
import { formatAppointmentDate, formatLocalTimeRange } from "@/lib/utils/time";
import {
  AppointmentResponse,
  AppointmentSearchFilter,
} from "@/types/appointment";
import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { IoAddCircle } from "react-icons/io5";
import { toast } from "react-toastify";

const ReceptionistAppointmentPage = () => {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
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
      0,
    );

    return localDateTime.toISOString();
  }

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
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    handleSearch(0);
  };

  return (
    <DashboardLayout title="Manage Appointments" menuItems={receptionistMenu}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Appointment Management
          </h2>
          <p className="text-sm text-slate-500">
            Book, manage, and view all appointments
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex gap-2 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <IoAddCircle size={18} />
          </span>{" "}
          Book Appointment
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
          <span className="absolute top-2.75 left-3 text-slate-900 text-sm">
            <FiSearch size={17} />
          </span>
        </div>

        <div className="relative flex-1">
          <input
            onChange={(e) =>
              setFilters({ ...filters, doctorName: e.target.value })
            }
            type="text"
            placeholder="Search by doctor name..."
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="absolute top-2.75 left-3 text-slate-900 text-sm">
            <FiSearch size={17} />
          </span>
        </div>

        <div className="relative flex-1">
          <input
            onChange={(e) =>
              setFilters({ ...filters, patientName: e.target.value })
            }
            type="text"
            placeholder="Search by patient name..."
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="absolute top-2.75 left-3 text-slate-900 text-sm">
            <FiSearch size={17} />
          </span>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <span>
            <FiFilter size={17} color="blue" />
          </span>{" "}
          Filters
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
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Filter Appointments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Status
              </label>
              <select
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value as any })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Day of Week
              </label>
              <select
                onChange={(e) =>
                  setFilters({ ...filters, day: e.target.value as any })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Appointment Date
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    date: new Date(e.target.value).toISOString(),
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Appointment Start Time
              </label>
              <input
                type="time"
                onChange={(e) =>
                  setFilters({ ...filters, fromTime: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Appointment End Time
              </label>
              <input
                type="time"
                onChange={(e) =>
                  setFilters({ ...filters, toTime: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={clearFilters}
              className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>

            <button
              onClick={() => handleSearch(0)}
              className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Empty State before search */}
      {!searched && !loading && (
        <div className="bg-white border rounded-xl p-10 text-center text-slate-500 text-sm">
          Use the search above to find appointments.
        </div>
      )}

      {/* TABLE */}
      {searched && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-sm text-slate-500">
              Loading appointments...
            </div>
          )}

          {!loading && appointments.length === 0 && (
            <div className="p-6 text-sm text-slate-500">
              No appointments found.
            </div>
          )}

          {!loading && appointments.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Code</th>
                    <th className="px-4 py-3 font-medium">Appointment Date</th>
                    <th className="px-4 py-3 font-medium">Appointment Time</th>
                    <th className="px-4 py-3 font-medium">Patient Name</th>
                    <th className="px-4 py-3 font-medium">Doctor Name</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr
                      className="border-b last:border-b-0 hover:bg-slate-50 transition"
                      key={appointment.id}
                    >
                      <td className="px-4 py-3 text-slate-700">
                        {appointment.appointmentCode}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatAppointmentDate(appointment.scheduledStart)}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {formatLocalTimeRange(
                          appointment.scheduledStart,
                          appointment.scheduledEnd,
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {appointment.patientName}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {appointment.doctorName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            appointment.status === "SCHEDULED"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      {searched && total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-2">
          <span className="text-slate-600">
            Page {page + 1} of {Math.ceil(total / pageSize)}
          </span>

          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => handleSearch(page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={(page + 1) * pageSize >= total}
              onClick={() => handleSearch(page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
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
          toast.success("Appointment booked successfully");
        }}
      />
    </DashboardLayout>
  );
};

export default ReceptionistAppointmentPage;
