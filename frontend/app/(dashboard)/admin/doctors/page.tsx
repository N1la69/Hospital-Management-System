"use client";

import CreateDoctorModal from "@/components/admin/CreateDoctorModal";
import DeleteDoctorModal from "@/components/doctor/DeleteDoctorModal";
import DoctorDetailsModal from "@/components/doctor/DoctorDetailsModal";
import EditDoctorModal from "@/components/doctor/EditDoctorModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  deleteDoctor,
  getDoctorDetails,
  searchDoctors,
  updateDoctor,
} from "@/lib/api/doctor.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import {
  DoctorDetailsResponse,
  DoctorResponse,
  DoctorSearchFilter,
} from "@/types/doctor";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FiFilter, FiSearch } from "react-icons/fi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const AdminDoctorsPage = () => {
  const [doctors, setDoctors] = useState<DoctorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorDetailsResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<DoctorSearchFilter>({});

  const [editDoctor, setEditDoctor] = useState<DoctorResponse | null>(null);
  const [deleteDoctorState, setDeleteDoctorState] =
    useState<DoctorResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 5;

  const refresh = () => handleSearch(page);

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);
    const payload: DoctorSearchFilter = { ...filters };

    try {
      if (searchText) {
        payload.name = searchText;
      }

      const result = await searchDoctors(payload, pageNo, pageSize);

      setDoctors(result.items);
      setTotal(result.total);
      setPage(pageNo);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to search doctors";
      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctor = async (form: any) => {
    if (!editDoctor) return;

    try {
      await updateDoctor(editDoctor.id, form);
      setEditDoctor(null);
      refresh();
      toast.success("Doctor updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update doctor");
    }
  };

  const handleDeleteDoctor = async () => {
    if (!deleteDoctorState) return;

    setDeleting(true);
    try {
      await deleteDoctor(deleteDoctorState.id);
      setDeleteDoctorState(null);
      refresh();
      toast.success("Doctor deleted successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete doctor");
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    handleSearch(0);
  };

  const openDoctorDetails = async (doctorId: string) => {
    try {
      const res = await getDoctorDetails(doctorId);
      setSelectedDoctor(res);
      setDetailsOpen(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load doctor details",
      );
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DashboardLayout title="Doctors" menuItems={adminMenu}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Doctor Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all registered doctors
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex gap-2 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <IoPersonAddSharp size={17} />
          </span>
          Add Doctor
        </button>
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

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-slate-500">Loading doctors...</div>
        )}

        {!loading && doctors.length === 0 && (
          <div className="p-6 text-sm text-slate-500">No doctors found.</div>
        )}

        {!loading && doctors.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-medium">Patient Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Specialization</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b last:border-b-0 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {doctor.doctorCode}
                    </td>
                    <td
                      className="px-4 py-3 text-blue-800 underline cursor-pointer"
                      onClick={() => openDoctorDetails(doctor.id)}
                    >
                      {doctor.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {doctor.specialization}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{doctor.email}</td>
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
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditDoctor(doctor)}
                          className="flex items-center justify-center rounded-md bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                          title="Edit doctor"
                        >
                          <FaUserEdit size={16} />
                        </button>

                        <button
                          onClick={() => setDeleteDoctorState(doctor)}
                          className="flex items-center justify-center rounded-md bg-red-50 p-2 text-red-700 hover:bg-red-100 transition focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Delete doctor"
                        >
                          <MdDelete size={16} />
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

      {/* PAGINATION */}
      {total > 0 && (
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

      <CreateDoctorModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refresh();
          toast.success("Doctor created successfully");
        }}
      />

      {editDoctor && (
        <EditDoctorModal
          open={!!editDoctor}
          doctor={editDoctor}
          onSave={handleUpdateDoctor}
          onClose={() => setEditDoctor(null)}
        />
      )}

      {deleteDoctorState && (
        <DeleteDoctorModal
          open={!!deleteDoctorState}
          doctorName={deleteDoctorState.fullName}
          onConfirm={handleDeleteDoctor}
          onClose={() => setDeleteDoctorState(null)}
          loading={deleting}
        />
      )}

      <DoctorDetailsModal
        open={detailsOpen}
        data={selectedDoctor}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </DashboardLayout>
  );
};

export default AdminDoctorsPage;
