"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { searchDoctors } from "@/lib/api/doctor.api";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";
import { DoctorResponse, DoctorSearchFilter } from "@/types/doctor";
import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";

const ReceptionistDoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<DoctorSearchFilter>({});

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);
    const payload: DoctorSearchFilter = { ...filters };

    try {
      if (searchText.trim()) {
        payload.name = searchText.trim();
      }

      const result = await searchDoctors(payload, pageNo, pageSize);

      setDoctors(result.items);
      setTotal(result.total);
      setPage(pageNo);
      setSearched(true);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to search doctor";

      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    setShowFilters(false);
    handleSearch(0);
  };

  return (
    <DashboardLayout title="View Doctors" menuItems={receptionistMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">Doctor Records</h2>
        <p className="text-sm text-slate-500">View all registered doctors</p>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by doctor name, code or email..."
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
            Filter Doctors
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Specialization */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Specialization
              </label>
              <select
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    specialization: e.target.value as any,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Specialization</option>
                <option value="CARDIOLOGY">Cardiology</option>
                <option value="NEUROLOGY">Neurology</option>
                <option value="ORTHOPEDICS">Orthopedics</option>
                <option value="PEDIATRICS">Pediatrics</option>
                <option value="GENERAL_MEDICINE">General Medicine</option>
                <option value="DERMATOLOGY">Dermatology</option>
                <option value="PSYCHIATRY">Psychiatry</option>
              </select>
            </div>

            {/* Status */}
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
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ON_LEAVE">On Leave</option>
              </select>
            </div>

            {/* Available Day */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Available Day
              </label>
              <select
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    availableDay: e.target.value as any,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Available Day</option>
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-5">
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
          Use the search above to find doctors.
        </div>
      )}

      {/* TABLE */}
      {searched && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-sm text-slate-500">Loading doctors...</div>
          )}

          {doctors.length === 0 && (
            <div className="p-6 text-sm text-slate-500">No doctors found.</div>
          )}

          {!loading && doctors.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Doctor Code</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Specialization</th>
                    <th className="px-4 py-3 font-medium">Email</th>
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
                      <td className="px-4 py-3 text-slate-800">
                        {doctor.specialization}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {doctor.email}
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
};

export default ReceptionistDoctorsPage;
