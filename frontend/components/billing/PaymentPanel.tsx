"use client";

import { BillingResponse, PaymentRequestInterface } from "@/types/billing";
import BillSummary from "./BillSummary";
import PaymentModal from "./PaymentModal";

interface Props {
  bill: BillingResponse;
  onPay: (billId: string, payload: PaymentRequestInterface) => Promise<any>;
}

const PaymentPanel = ({ bill, onPay }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bill summary */}
      <div className="lg:col-span-2">
        <BillSummary bill={bill} />
      </div>

      {/* Payment section */}
      <div className="lg:col-span-1">
        {bill.status === "PAID" ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-600">
            No payment required
          </div>
        ) : (
          <PaymentModal bill={bill} onPay={onPay} />
        )}
      </div>
    </div>
  );
};

export default PaymentPanel;
