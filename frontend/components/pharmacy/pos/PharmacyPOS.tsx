"use client";

import { useState } from "react";
import { usePos } from "./PosContext";
import { createBill } from "@/lib/api/billing.api";
import PaymentModal from "@/components/billing/PaymentModal";

const TAX_PERCENT = 12;

const PharmacyPOS = () => {
  const { items, remove, clear } = usePos();

  const [walkInName, setWalkInName] = useState("");
  const [patientId, setPatientId] = useState<string | undefined>();
  const [appointmentId, setAppointmentId] = useState<string | undefined>();
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
        items: billItems,
      });

      setBillId(res.id);
      clear();
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

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

      {billId && (
        <PaymentModal
          bill={{ id: billId } as any}
          onPay={async () => setBillId(null)}
        />
      )}
    </div>
  );
};

export default PharmacyPOS;
