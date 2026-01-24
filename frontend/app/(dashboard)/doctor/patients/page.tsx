"use client";

import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import {
  DoctorPatientRowResponse,
  DoctorPatientSearchFilter,
} from "@/types/appointment";
import { toast } from "react-toastify";
import { searchMyPatients } from "@/lib/api/doctor.api";
import { useRouter } from "next/navigation";

export default function DoctorPatientsPage() {
  const router = useRouter();

  const [rows, setRows] = useState<DoctorPatientRowResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);

    try {
      const payload: DoctorPatientSearchFilter = {};

      if (searchText.trim()) payload.searchText = searchText.trim();
      if (fromDate) payload.fromDate = new Date(fromDate).toISOString();
      if (toDate) payload.toDate = new Date(toDate).toISOString();

      const result = await searchMyPatients(payload, pageNo, pageSize);

      setRows(result.items);
      setTotal(result.total);
      setPage(pageNo);
      setSearched(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch your patients",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setFromDate("");
    setToDate("");
    setShowFilters(false);
    handleSearch(0);
  };

  const goToPatient = (patientId: string) => {
    router.push(`/doctor/patients/${patientId}`);
  };

  return (
    <DashboardLayout title="My Patients" menuItems={doctorMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Patient History
        </h2>
        <p className="text-sm text-slate-500">
          View all patients you have consulted or are scheduled to consult.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by patient code, appointment code, or name..."
            className="w-full rounded-md border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />
          <span className="absolute top-2.5 left-3 text-slate-600">
            <FiSearch size={17} />
          </span>
        </div>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <FiFilter size={16} className="text-blue-600" />
          Filters
        </button>

        <button
          onClick={() => handleSearch(0)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-white border rounded-xl p-5 mb-4 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Filter by Appointment Date & Time
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                From
              </label>
              <input
                type="datetime-local"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                To
              </label>
              <input
                type="datetime-local"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
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

      {/* EMPTY STATE */}
      {!searched && !loading && (
        <div className="bg-white border rounded-xl p-10 text-center text-slate-500 text-sm">
          Use the search above to view your patients.
        </div>
      )}

      {/* TABLE */}
      {searched && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-sm text-slate-500">
              Loading patients...
            </div>
          )}

          {!loading && rows.length === 0 && (
            <div className="p-6 text-sm text-slate-500">No records found.</div>
          )}

          {!loading && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Patient Code</th>
                    <th className="px-4 py-3 font-medium">Appointment Code</th>
                    <th className="px-4 py-3 font-medium">Patient Name</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((item, idx) => {
                    const d = new Date(item.appointmentDateTime);

                    return (
                      <tr
                        key={idx}
                        className="border-b last:border-b-0 hover:bg-slate-50 transition cursor-pointer"
                        onClick={() => goToPatient(item.patientId)}
                      >
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {item.patientCode}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-700">
                          {item.appointmentCode}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {item.patientName}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {d.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {d.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    );
                  })}
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
    </DashboardLayout>
  );
}
