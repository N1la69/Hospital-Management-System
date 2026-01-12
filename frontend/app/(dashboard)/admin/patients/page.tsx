"use client";

import CreatePatientModal from "@/components/admin/CreatePatientModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchPatients, searchPatients } from "@/lib/api/patient.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import { PatientResponse, PatientSearchFilter } from "@/types/patient";
import { useEffect, useState } from "react";

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<PatientSearchFilter>({});

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 3;

  // const loadAllPatients = () => {
  //   setLoading(true);
  //   fetchPatients()
  //     .then(setPatients)
  //     .finally(() => setLoading(false));
  // };

  const loadAllPatients = () => {
    handleSearch(0);
  };

  const dateToInstant = (dateStr: string, endOfDay = false) => {
    const date = new Date(dateStr);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);
    const payload: PatientSearchFilter = { ...filters };

    try {
      if (searchText) {
        payload.name = searchText;
      }

      if (filters.dobFrom) payload.dobFrom = dateToInstant(filters.dobFrom);
      if (filters.dobTo) payload.dobTo = dateToInstant(filters.dobTo, true);

      const result = await searchPatients(payload, pageNo, pageSize);

      setPatients(result.items);
      setTotal(result.total);
      setPage(pageNo);
      console.log({ total, pageSize, page });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to search patient";
      alert(message);
      console.log(message);
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
    loadAllPatients();
  }, []);

  return (
    <DashboardLayout title="Patients" menuItems={adminMenu}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Patient Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all registered patients
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          + Add Patient
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by name, code or email..."
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border p-4 rounded-xl mb-4">
          <select
            onChange={(e) =>
              setFilters({ ...filters, bloodGroup: e.target.value as any })
            }
          >
            <option value="">Blood Group</option>
            <option value="A_POS">A+</option>
            <option value="A_NEG">A-</option>
            <option value="B_POS">B+</option>
            <option value="B_NEG">B-</option>
            <option value="O_POS">O+</option>
            <option value="O_NEG">O-</option>
            <option value="AB_POS">AB+</option>
            <option value="AB_NEG">AB-</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value as any })
            }
          >
            <option value="">Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="DECEASED">DECEASED</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({ ...filters, gender: e.target.value as any })
            }
          >
            <option value="">Gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>

          <input
            type="date"
            onChange={(e) =>
              setFilters({ ...filters, dobFrom: e.target.value })
            }
          />
          <input
            type="date"
            onChange={(e) => setFilters({ ...filters, dobTo: e.target.value })}
          />

          <div className="col-span-full flex gap-2">
            <button
              onClick={() => handleSearch()}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
            <button onClick={clearFilters} className="border px-4 py-2 rounded">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-slate-500">Loading patients...</div>
        )}

        {!loading && patients.length === 0 && (
          <div className="p-6 text-sm text-slate-500">No patients found.</div>
        )}

        {!loading && patients.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-medium">Patient Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Blood Group</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {patients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b last:border-b-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {patient.patientCode}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {patient.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {patient.bloodGroup}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          patient.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {Math.ceil(total / pageSize) > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <span>
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

      <CreatePatientModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          fetchPatients();
        }}
      />
    </DashboardLayout>
  );
};

export default AdminPatientsPage;
