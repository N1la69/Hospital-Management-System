"use client";

import { useState } from "react";
import { usePos } from "./PosContext";
import { createBill, getBillDetails, payment } from "@/lib/api/billing.api";
import PaymentModal from "@/components/billing/PaymentModal";
import { BillingResponse, PaymentRequestInterface } from "@/types/billing";
import { toast } from "react-toastify";
import { FiShoppingCart, FiUser, FiTrash2 } from "react-icons/fi";

const TAX_PERCENT = 5;

const PharmacyPOS = () => {
  const { items, remove, clear } = usePos();

  const [walkInName, setWalkInName] = useState("");
  const [patientId, setPatientId] = useState<string | undefined>();
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
  const [createdBill, setCreatedBill] = useState<BillingResponse | null>(null);
  const [billId, setBillId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce(
    (s, i) => s + i.medicine.sellingPrice * i.qty,
    0,
  );

  const tax = (subtotal * TAX_PERCENT) / 100;
  const total = subtotal + tax;

  const checkout = async () => {
    if (!patientId && !walkInName.trim()) {
      toast.error("Enter customer name for walk-in billing");
      return;
    }

    setLoading(true);

    try {
      const billItems = items.map((i) => ({
        description: i.medicine.medicineName,
        type: "MEDICINE" as const,
        quantity: i.qty,
        unitPrice: i.medicine.sellingPrice,
      }));

      const res = await createBill({
        patientId: patientId || undefined,
        appointmentId: appointmentId || undefined,
        walkInName: patientId ? undefined : walkInName,
        tax,
        items: billItems,
      });

      let fullBill = await getBillDetails(res.id);

      fullBill.subtotal = subtotal;
      fullBill.tax = tax;
      fullBill.totalAmount = total;

      setCreatedBill(fullBill);
      setBillId(res.id);
      toast.success("Bill created successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (
    billId: string,
    payload: PaymentRequestInterface,
  ) => {
    const updated = await payment(billId, payload);

    setCreatedBill(updated);

    if (updated.status === "PAID") {
      setCreatedBill(null);
      setBillId(null);
      clear();

      window.dispatchEvent(new Event("stock-updated"));
    }
  };

  if (items.length === 0 && !createdBill) return null;

  return (
    <div className="bg-white border rounded-xl shadow-sm mt-4">
      {/* HEADER */}
      <div className="px-5 py-4 border-b flex items-center gap-2">
        <FiShoppingCart className="text-green-700" />
        <h3 className="font-semibold text-slate-800">POS Cart</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* CUSTOMER */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            <FiUser className="inline mr-1" />
            Customer Name (Walk-in)
          </label>

          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-600"
            placeholder="Enter customer name"
            value={walkInName}
            onChange={(e) => setWalkInName(e.target.value)}
          />
        </div>

        {/* ITEMS */}
        <div className="space-y-2">
          {items.map((i) => (
            <div
              key={i.medicine.id}
              className="flex justify-between items-center bg-slate-50 rounded-lg px-3 py-2 border"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {i.medicine.medicineName}
                </p>
                <p className="text-xs text-slate-500">
                  ₹{i.medicine.sellingPrice} × {i.qty}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-800">
                  ₹{(i.medicine.sellingPrice * i.qty).toFixed(2)}
                </span>

                <button
                  onClick={() => remove(i.medicine.id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="bg-slate-50 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-600">Tax ({TAX_PERCENT}%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold text-base pt-1 border-t mt-1">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* ACTION FOOTER */}
        <div className="flex justify-end gap-3 pt-3 border-t">
          {!createdBill && (
            <button
              disabled={loading}
              onClick={checkout}
              className="rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 transition"
            >
              {loading ? "Creating Bill..." : "Create Bill"}
            </button>
          )}

          {createdBill && (
            <PaymentModal bill={createdBill} onPay={handlePayment} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyPOS;
