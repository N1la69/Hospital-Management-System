"use client";

import { useState } from "react";
import { usePos } from "./PosContext";
import { createBill, getBillDetails, payment } from "@/lib/api/billing.api";
import PaymentModal from "@/components/billing/PaymentModal";
import { BillingResponse, PaymentRequestInterface } from "@/types/billing";
import { toast } from "react-toastify";

const TAX_PERCENT = 12;

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

      let fullBill;
      try {
        fullBill = await getBillDetails(res.id);
        fullBill.subtotal = subtotal;
        fullBill.tax = tax;
        fullBill.totalAmount = total;
      } catch (e) {
        toast.error("Bill created but failed to load details");
        return;
      }

      setCreatedBill(fullBill);
      setBillId(res.id);
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
    <div className="border rounded-xl p-4 mt-4 space-y-3">
      <h3 className="font-semibold">POS Cart</h3>

      <input
        className="border p-2 w-full"
        placeholder="Customer Name (for walk-in)"
        value={walkInName}
        onChange={(e) => setWalkInName(e.target.value)}
      />

      {items.map((i) => (
        <div
          key={i.medicine.id}
          className="flex justify-between text-sm border-b pb-1"
        >
          <span>
            {i.medicine.medicineName} × {i.qty}
          </span>

          <div className="flex gap-2 items-center">
            <span>₹{i.medicine.sellingPrice * i.qty}</span>

            <button
              onClick={() => remove(i.medicine.id)}
              className="text-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <div className="text-right text-sm">
        <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
        <div>
          Tax ({TAX_PERCENT}%): ₹{tax.toFixed(2)}
        </div>
        <div className="font-bold">Total: ₹{total.toFixed(2)}</div>
      </div>

      <button
        disabled={loading}
        onClick={checkout}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Create Bill
      </button>

      {createdBill && <PaymentModal bill={createdBill} onPay={handlePayment} />}
    </div>
  );
};

export default PharmacyPOS;
