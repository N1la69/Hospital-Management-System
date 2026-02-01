"use client";

import BillDetailsModal from "@/components/billing/BillDetailsModal";
import CompletePaymentModal from "@/components/billing/CompletePaymentModal";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getBillDetails, searchBills } from "@/lib/api/billing.api";
import { receptionistMenu } from "@/lib/constants/sidebarMenus";
import { BillingResponse, BillSearchFilter } from "@/types/billing";
import dayjs from "dayjs";
import { useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { toast } from "react-toastify";

const ReceptionistBillingPage = () => {
  const [bills, setBills] = useState<BillingResponse[]>([]);

  const [paymentBillId, setPaymentBillId] = useState<string | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [filters, setFilters] = useState<BillSearchFilter>({});

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillingResponse | null>(
    null,
  );

  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const dateToInstant = (dateStr: string, endOfDay = false) => {
    const date = new Date(dateStr);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const openBillDetails = async (billId: string) => {
    try {
      const res = await getBillDetails(billId);
      setSelectedBill(res);
      setDetailsOpen(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load bill details",
      );
    }
  };

  const openCompletePayment = (billId: string) => {
    setPaymentBillId(billId);
    setPaymentOpen(true);
  };

  const handleSearch = async (pageNo = 0) => {
    setLoading(true);

    const payload: BillSearchFilter = { ...filters };

    try {
      if (searchText.trim()) {
        payload.name = searchText.trim();
      }

      if (filters.fromDate) payload.fromDate = dateToInstant(filters.fromDate);
      if (filters.toDate) payload.toDate = dateToInstant(filters.toDate, true);

      const result = await searchBills(payload, pageNo, pageSize);

      setBills(result.items);
      setTotal(result.total);
      setPage(pageNo);
      setSearched(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to search bill",
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
    <DashboardLayout title="Billing Page" menuItems={receptionistMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">View Bills</h2>
        <p className="text-sm text-slate-500">
          View all bills and their status
        </p>
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
            Filter Bills
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Status
              </label>
              <select
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    paymentStatus: e.target.value as any,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">Payment Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PARTIALLY_PAID">Partially Paid</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Payment Method
              </label>
              <select
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    paymentMethod: e.target.value as any,
                  })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All</option>
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
              </select>
            </div>

            {/* From Date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
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
          Use the search above to find bills.
        </div>
      )}

      {/* TABLE */}
      {searched && (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          {loading && (
            <div className="p-6 text-sm text-slate-500">Loading bills...</div>
          )}

          {bills.length === 0 && (
            <div className="p-6 text-sm text-slate-500">No bills found.</div>
          )}

          {!loading && bills.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-medium">Bill No.</th>
                    <th className="px-4 py-3 font-medium">Patient Name</th>
                    <th className="px-4 py-3 font-medium">Total Amt. (₹)</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Payment Mode</th>
                    <th className="px-4 py-3 font-medium">Updated At</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {bills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b last:border-b-0 hover:bg-slate-50 transition"
                    >
                      <td
                        className="px-4 py-3 font-mono text-blue-700 underline cursor-pointer"
                        onClick={() => openBillDetails(bill.id)}
                      >
                        {bill.billNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {bill.patientName}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {bill.totalAmount}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                            bill.status === "PAID"
                              ? "bg-green-100 text-green-700"
                              : bill.status === "PARTIALLY_PAID"
                                ? "bg-yellow-200 text-yellow-600"
                                : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {bill.payments?.[bill.payments.length - 1]?.method ??
                          "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {dayjs(bill.updatedAt).format("DD/MM/YYYY HH:mm")}
                      </td>
                      <td className="px-4 py-3">
                        {bill.status === "PAID" ? (
                          <span className="text-xs text-slate-500">
                            No action needed
                          </span>
                        ) : (
                          <button
                            onClick={() => openCompletePayment(bill.id)}
                            className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
                          >
                            Complete Payment
                          </button>
                        )}
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

      <BillDetailsModal
        open={detailsOpen}
        data={selectedBill}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedBill(null);
        }}
      />

      <CompletePaymentModal
        open={paymentOpen}
        billId={paymentBillId}
        onClose={() => {
          setPaymentOpen(false);
          setPaymentBillId(null);
        }}
        onUpdated={(updatedBill) => {
          setBills((prev) =>
            prev.map((b) => (b.id === updatedBill.id ? updatedBill : b)),
          );
        }}
      />
    </DashboardLayout>
  );
};

export default ReceptionistBillingPage;
