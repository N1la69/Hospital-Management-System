"use client";

import { BillingResponse } from "@/types/billing";

interface Props {
  bill: BillingResponse;
}

const BillSummary = ({ bill }: Props) => {
  return (
    <div className="border rounded-xl p-4 space-y-3">
      <h2 className="text-lg font-semibold">Bill Summary</h2>

      <div className="text-sm text-gray-600">
        Bill No: {bill.billNumber} | Patient: {bill.patientName}
      </div>

      <table className="w-full border mt-2 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={i} className="text-center">
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>₹{item.unitPrice}</td>
              <td>₹{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right space-y-1">
        <div>Subtotal: ₹{bill.subtotal}</div>
        <div>Tax: ₹{bill.tax}</div>
        <div>Discount: ₹{bill.discount}</div>
        <div className="font-bold">Total: ₹{bill.totalAmount}</div>
        <div>Paid: ₹{bill.amountPaid}</div>
        <div>Status: {bill.status}</div>
      </div>
    </div>
  );
};

export default BillSummary;
