"use client";

import { useBilling } from "@/lib/hooks/useBilling";
import { AddBillItemRequest, BillingResponse } from "@/types/billing";
import BillItemsForm from "./BillItemsForm";
import BillSummary from "./BillSummary";
import PaymentModal from "./PaymentModal";
import { useState } from "react";

interface Props {
  patientId: string;
  appointmentId?: string;
  defaultItems?: AddBillItemRequest[];
}

const BillingPanel = ({
  patientId,
  appointmentId,
  defaultItems = [],
}: Props) => {
  const [bill, setBill] = useState<BillingResponse | null>(null);

  const { createNewBill, addPayment } = useBilling();

  const handleCreateBill = async (items: AddBillItemRequest[]) => {
    const created = await createNewBill(patientId, items, appointmentId);
    setBill(created);
  };

  const handleAddPayment = async (billId: string, payload: any) => {
    const updated = await addPayment(billId, payload);
    setBill(updated);
    return updated;
  };

  return (
    <div className="space-y-6">
      {/* Step header */}
      <div className="flex items-center justify-between border-b pb-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Billing & Payments
        </h2>

        <span className="text-xs text-slate-600">
          {bill ? "Step 2 · Payment" : "Step 1 · Create Bill"}
        </span>
      </div>

      {!bill && (
        <BillItemsForm
          defaultItems={defaultItems}
          onSubmit={handleCreateBill}
        />
      )}

      {bill && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BillSummary bill={bill} />
          </div>

          {bill.status !== "PAID" && (
            <div className="lg:col-span-1 flex flex-col gap-4">
              <PaymentModal bill={bill} onPay={handleAddPayment} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BillingPanel;
