"use client";

import CreatePatientModal from "@/components/patient/CreatePatientModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EditPatientModal from "@/components/patient/EditPatientModal";
import PatientDetailsModal from "@/components/patient/PatientDetailsModal";
import {
  getPatientDetails,
  searchPatients,
  updatePatient,
} from "@/lib/api/patient.api";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";
import {
  bloodGroupMapper,
  PatientDetailsResponse,
  PatientResponse,
  PatientSearchFilter,
} from "@/types/patient";
import { useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FiFilter, FiSearch } from "react-icons/fi";
import { IoPersonAddSharp } from "react-icons/io5";
import { toast } from "react-toastify";

const ReceptionistPatientPage = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<PatientSearchFilter>({});

  const [editPatient, setEditPatient] = useState<PatientResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientDetailsResponse | null>(null);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const refresh = () => handleSearch(page);

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
      if (searchText.trim()) {
        payload.name = searchText.trim();
      }

      if (filters.dobFrom) payload.dobFrom = dateToInstant(filters.dobFrom);
      if (filters.dobTo) payload.dobTo = dateToInstant(filters.dobTo, true);

      const result = await searchPatients(payload, pageNo, pageSize);

      setPatients(result.items);
      setTotal(result.total);
      setPage(pageNo);
      setSearched(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to search patient",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePatient = async (form: any) => {
    if (!editPatient) return;

    try {
      await updatePatient(editPatient.id, form);
      setEditPatient(null);
      refresh();
      toast.success("Patient updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update patient");
    }
  };

  const openPatientDetails = async (patientId: string) => {
    try {
      const res = await getPatientDetails(patientId);
      setSelectedPatient(res);
      setDetailsOpen(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load patient details",
      );
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    handleSearch(0);
  };

  return (
    <DashboardLayout title="Patient Utilities" menuItems={receptionistMenu}>
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
          className="inline-flex gap-2 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <IoPersonAddSharp size={17} />
          </span>
          Add Patient
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
            Filter Patients
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Blood Group
              </label>
              <select
                onChange={(e) =>
                  setFilters({ ...filters, bloodGroup: e.target.value as any })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="A_POS">A+</option>
                <option value="A_NEG">A-</option>
                <option value="B_POS">B+</option>
                <option value="B_NEG">B-</option>
                <option value="O_POS">O+</option>
                <option value="O_NEG">O-</option>
                <option value="AB_POS">AB+</option>
                <option value="AB_NEG">AB-</option>
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
                <option value="DECEASED">Deceased</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Gender
              </label>
              <select
                onChange={(e) =>
                  setFilters({ ...filters, gender: e.target.value as any })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* DOB From */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                DOB From
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, dobFrom: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* DOB To */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                DOB To
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, dobTo: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
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
          Use the search above to find patients.
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

          {patients.length === 0 && (
            <div className="p-6 text-sm text-slate-500">No patients found.</div>
          )}

          {!loading && patients.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Patient Code</th>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Gender</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Blood Group</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
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
                      <td
                        className="px-4 py-3 text-blue-800 underline cursor-pointer"
                        onClick={() => openPatientDetails(patient.id)}
                      >
                        {patient.fullName}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {patient.gender}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {patient.email}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {bloodGroupMapper[
                          patient.bloodGroup as keyof typeof bloodGroupMapper
                        ] || patient.bloodGroup}
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
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditPatient(patient)}
                            className="flex items-center justify-center rounded-md bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="Edit patient"
                          >
                            <FaUserEdit size={16} />
                          </button>
                        </div>
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

      <CreatePatientModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refresh();
          toast.success("Patient created successfully");
        }}
      />

      {editPatient && (
        <EditPatientModal
          open={!!editPatient}
          patient={editPatient}
          onSave={handleUpdatePatient}
          onClose={() => setEditPatient(null)}
        />
      )}

      <PatientDetailsModal
        open={detailsOpen}
        data={selectedPatient}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPatient(null);
        }}
      />
    </DashboardLayout>
  );
};

export default ReceptionistPatientPage;
