"use client";

import { BillingResponse, PaymentRequestInterface } from "@/types/billing";
import { useState } from "react";
import Modal from "../ui/Modal";
import { IoAddCircle } from "react-icons/io5";
import { toast } from "react-toastify";

interface Props {
  bill: BillingResponse;
  onPay: (billId: string, payload: PaymentRequestInterface) => Promise<any>;
}

const PaymentModal = ({ bill, onPay }: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"CASH" | "UPI" | "CARD">("CASH");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = bill.totalAmount - bill.amountPaid;

  const handlePay = async () => {
    if (amount <= 0 || amount > remaining) {
      toast.error("Invalid payment amount");
      return;
    }

    setLoading(true);
    try {
      await onPay(bill.id, {
        amount,
        method,
        reference: reference || undefined,
      });

      setOpen(false);
      setAmount(0);
      setReference("");
    } catch {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {bill.status !== "PAID" && (
        <button
          onClick={() => setOpen(true)}
          className="w-full inline-flex gap-1 items-center justify-center rounded-md bg-green-600 py-3 text-sm font-semibold text-white hover:bg-green-700"
        >
          <IoAddCircle size={17} />
          Add Payment
        </button>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Payment"
        size="sm"
      >
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
            Remaining amount:
            <span className="ml-1 font-semibold text-green-700">
              ₹{remaining}
            </span>
          </div>

          <input
            type="number"
            min={1}
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            onFocus={() => amount === 0 && setAmount(remaining)}
            className="border p-2 w-full rounded-md"
            placeholder="Amount"
          />

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as any)}
            className="border p-2 w-full rounded-md"
          >
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
          </select>

          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Reference (optional)"
            className="border p-2 w-full rounded-md"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="border px-4 py-2 rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handlePay}
              disabled={loading}
              className="bg-green-600 px-4 py-2 text-white rounded disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaymentModal;
