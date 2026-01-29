"use client";

import { BillingResponse, PaymentRequestInterface } from "@/types/billing";
import { useState } from "react";
import { toast } from "react-toastify";
import Modal from "../ui/Modal";

interface Props {
  bill: BillingResponse;
  onPay: (billId: string, payload: PaymentRequestInterface) => Promise<any>;
}

const PaymentModal = ({ bill, onPay }: Props) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = bill.totalAmount - bill.amountPaid;

  const handlePay = async () => {
    if (amount <= 0) {
      alert("Invalid amount");
      return;
    }
    setLoading(true);

    try {
      await onPay(bill.id, { amount, method, reference });
      setOpen(false);
      setAmount(0);
      setReference("");
    } catch (err: any) {
      toast.error("Error paying: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Add Payment
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add payment"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-sm text-slate-600">
            Remaining amount: <b>₹{remaining}</b>
          </div>

          <input
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <select
            className="border p-2 w-full rounded"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="CASH">CASH</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
          </select>

          <input
            className="border p-2 w-full rounded"
            placeholder="Reference (optional)"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              onClick={handlePay}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
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
