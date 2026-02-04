"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CreatePharmacistModal from "@/components/pharmacist/CreatePharmacistModal";
import DeletePharmacistModal from "@/components/pharmacist/DeletePharmacistModal";
import EditPharmacistModal from "@/components/pharmacist/EditPharmacistModal";
import PharmacistDetailsModal from "@/components/pharmacist/PharmacistDetailsModal";
import {
  deletePharmacist,
  getPharmacistDetails,
  searchPharmacists,
  updatePharmacist,
} from "@/lib/api/pharmacist.api";
import { adminMenu } from "@/lib/constants/sidebarMenus";
import { PharmacistResponse, PharmacistSearchFilter } from "@/types/pharmacist";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { FiFilter, FiSearch } from "react-icons/fi";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const AdminPharmacistPage = () => {
  const [pharmacists, setPharmacists] = useState<PharmacistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [selectedPharmacist, setSelectedPharmacist] =
    useState<PharmacistResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [filters, setFilters] = useState<PharmacistSearchFilter>({});

  const [editPharmacist, setEditPharmacist] =
    useState<PharmacistResponse | null>(null);
  const [deletePharmacistState, setDeletePharmacistState] =
    useState<PharmacistResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const refresh = () => handleSearch(page);

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);
    const payload: PharmacistSearchFilter = { ...filters };

    try {
      if (searchText) {
        payload.name = searchText;
      }

      const result = await searchPharmacists(payload, pageNo, pageSize);

      setPharmacists(result.items);
      setTotal(result.total);
      setPage(pageNo);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to search pharmacists";
      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePharmacist = async (form: any) => {
    if (!editPharmacist) return;

    try {
      await updatePharmacist(editPharmacist.id, form);
      setEditPharmacist(null);
      refresh();
      toast.success("Pharmacist updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update Pharmacist");
    }
  };

  const handleDeletePharmacist = async () => {
    if (!deletePharmacistState) return;

    setDeleting(true);
    try {
      await deletePharmacist(deletePharmacistState.id);
      setDeletePharmacistState(null);
      refresh();
      toast.success("Pharmacist deleted successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to delete Pharmacist");
    } finally {
      setDeleting(false);
    }
  };

  const openPharmacistDetails = async (pharmacistId: string) => {
    try {
      const res = await getPharmacistDetails(pharmacistId);
      setSelectedPharmacist(res);
      setDetailsOpen(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load pharmacist details",
      );
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchText("");
    handleSearch(0);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <DashboardLayout title="Pharmacists" menuItems={adminMenu}>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Pharmacist Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all registered pharmacists
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex gap-2 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <IoPersonAddSharp size={17} />
          </span>
          Add Pharmacist
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by pharmacist name or code..."
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
            Filter Pharmacists
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
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
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

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-slate-500">
            Loading pharmacists...
          </div>
        )}

        {!loading && pharmacists.length === 0 && (
          <div className="p-6 text-sm text-slate-500">
            No pharmacists found.
          </div>
        )}

        {!loading && pharmacists.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr className="text-left text-slate-600">
                  <th className="px-4 py-3 font-medium">Pharmacist Code</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pharmacists.map((pharmacist) => (
                  <tr
                    key={pharmacist.id}
                    className="border-b last:border-b-0 transition"
                  >
                    <td className="px-4 py-3 font-mono text-slate-700">
                      {pharmacist.pharmacistCode}
                    </td>
                    <td
                      className="px-4 py-3 text-blue-800 underline cursor-pointer"
                      onClick={() => openPharmacistDetails(pharmacist.id)}
                    >
                      {pharmacist.fullName}
                    </td>
                    <td className="px-4 py-3 text-slate-800">
                      {pharmacist.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          pharmacist.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {pharmacist.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditPharmacist(pharmacist)}
                          className="flex items-center justify-center rounded-md bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                          title="Edit pharmacist"
                        >
                          <FaUserEdit size={16} />
                        </button>

                        <button
                          onClick={() => setDeletePharmacistState(pharmacist)}
                          className="flex items-center justify-center rounded-md bg-red-50 p-2 text-red-700 hover:bg-red-100 transition focus:outline-none focus:ring-2 focus:ring-red-300"
                          title="Delete receptionist"
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

      <CreatePharmacistModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refresh();
          toast.success("Pharmacist created successfully");
        }}
      />

      {editPharmacist && (
        <EditPharmacistModal
          open={!!editPharmacist}
          pharmacist={editPharmacist}
          onSave={handleUpdatePharmacist}
          onClose={() => setEditPharmacist(null)}
        />
      )}

      {deletePharmacistState && (
        <DeletePharmacistModal
          open={!!deletePharmacistState}
          pharmacistName={deletePharmacistState.fullName}
          onConfirm={handleDeletePharmacist}
          onClose={() => setDeletePharmacistState(null)}
          loading={deleting}
        />
      )}

      <PharmacistDetailsModal
        open={detailsOpen}
        data={selectedPharmacist}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedPharmacist(null);
        }}
      />
    </DashboardLayout>
  );
};

export default AdminPharmacistPage;
