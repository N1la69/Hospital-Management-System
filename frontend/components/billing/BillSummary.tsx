"use client";

import { BillingResponse } from "@/types/billing";

interface Props {
  bill: BillingResponse;
}

const BillSummary = ({ bill }: Props) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            Bill #{bill.billNumber}
          </h2>
          <p className="text-xs text-slate-500">{bill.patientName}</p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            bill.status === "PAID"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {bill.status}
        </span>
      </div>

      <table className="w-full text-sm border rounded-lg overflow-hidden">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-3 py-2 text-left">Item</th>
            <th className="px-3 py-2 text-right">Qty</th>
            <th className="px-3 py-2 text-right">Unit</th>
            <th className="px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={i} className="border-t">
              <td className="px-3 py-2">{item.description}</td>
              <td className="px-3 py-2 text-right">{item.quantity}</td>
              <td className="px-3 py-2 text-right">₹{item.unitPrice}</td>
              <td className="px-3 py-2 text-right font-medium">
                ₹{item.totalPrice}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bg-slate-50 rounded-lg p-4 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{bill.subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{bill.tax}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>- ₹{bill.discount}</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t">
          <span>Total</span>
          <span>₹{bill.totalAmount}</span>
        </div>
        <div className="flex justify-between text-green-700">
          <span>Paid</span>
          <span>₹{bill.amountPaid}</span>
        </div>
      </div>
    </div>
  );
};

export default BillSummary;
