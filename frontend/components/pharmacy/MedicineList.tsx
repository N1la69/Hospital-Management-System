"use client";

import { MedicineResponse, MedicineSearchFilter } from "@/types/pharmacy";
import { useEffect, useState } from "react";
import AddMedicineModal from "./AddMedicineModal";
import AddStockModal from "./AddStockModal";
import { FiFilter, FiSearch } from "react-icons/fi";
import { FaBoxOpen } from "react-icons/fa";
import { toast } from "react-toastify";
import { searchMedicines } from "@/lib/api/pharmacy.api";
import { RiMedicineBottleFill } from "react-icons/ri";

const MedicineList = () => {
  const [medicines, setMedicines] = useState<MedicineResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<MedicineSearchFilter>({});

  const [stockFor, setStockFor] = useState<string | null>(null);

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const refresh = () => handleSearch(page);

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);

    const payload: MedicineSearchFilter = { ...filters };

    try {
      if (searchText.trim()) {
        payload.name = searchText.trim();
      }

      if (filters.category) payload.category = filters.category;
      if (filters.status) payload.status = filters.status;

      const result = await searchMedicines(payload, pageNo, pageSize);

      setMedicines(result.items);
      setTotal(result.total);
      setPage(pageNo);
      setSearched(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to search medicine",
      );
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
    <>
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Medicine Records
          </h2>
          <p className="text-sm text-slate-500">
            Manage and view all medicines available in the pharmacy.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="inline-flex gap-2 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <RiMedicineBottleFill size={17} />
          </span>
          Add New Medicine
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
        <div className="relative flex-1">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search by medicine name, or manufacturer..."
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
            Filter Medicines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Category
              </label>
              <select
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value as any })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="TABLET">Tablet</option>
                <option value="CAPSULE">Capsule</option>
                <option value="SYRUP">Syrup</option>
                <option value="INJECTION">Injection</option>
                <option value="OINTMENT">Ointment</option>
                <option value="DROPS">Drops</option>
                <option value="OTHER">Other</option>
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
                <option value="EXPIRED">Expired</option>
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
          Use the search above to find medicines.
        </div>
      )}

      {/* TABLE */}
      {searched && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-sm text-slate-500">
              Loading medicines...
            </div>
          )}

          {medicines.length === 0 && (
            <div className="p-6 text-sm text-slate-500">
              No medicines found.
            </div>
          )}

          {!loading && medicines.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Med. Code</th>
                    <th className="px-4 py-3 font-medium">Med. Name</th>
                    <th className="px-4 py-3 font-medium">Manufacturer Name</th>
                    <th className="px-4 py-3 font-medium">Price (₹)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {medicines.map((medicine) => (
                    <tr
                      key={medicine.id}
                      className="border-b last:border-b-0 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {medicine.medicineCode}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {medicine.medicineName}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {medicine.manufacturerName}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {medicine.sellingPrice}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            medicine.status === "ACTIVE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-200 text-red-600"
                          }`}
                        >
                          {medicine.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStockFor(medicine.id)}
                            className="flex items-center justify-center rounded-md bg-blue-50 p-2 text-blue-700 hover:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
                            title="Add Stock"
                          >
                            <FaBoxOpen size={16} />
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

      <AddMedicineModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
          refresh();
          toast.success("Medicine added successfully");
        }}
      />

      {stockFor && (
        <AddStockModal
          open={!!stockFor}
          medicineId={stockFor}
          onClose={() => setStockFor(null)}
        />
      )}
    </>
  );
};

export default MedicineList;
