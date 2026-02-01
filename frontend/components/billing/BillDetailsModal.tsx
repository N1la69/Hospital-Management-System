"use client";

import { BillingResponse } from "@/types/billing";
import Modal from "../ui/Modal";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  data: BillingResponse | null;
  onClose: () => void;
}

const InfoItem = ({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string | number;
  full?: boolean;
}) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-sm font-medium text-slate-800 wrap-break-word">
      {value}
    </p>
  </div>
);

const statusColor = (status: BillingResponse["status"]) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "PARTIALLY_PAID":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const BillDetailsModal = ({ open, data, onClose }: Props) => {
  if (!data) return null;

  return (
    <Modal open={open} onClose={onClose} title="Bill Details" size="lg">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Bill #{data.billNumber}
            </h2>
          </div>

          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusColor(
              data.status,
            )}`}
          >
            {data.status.replace("_", " ")}
          </span>
        </div>

        {/* Bill Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Bill Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem label="Patient Name" value={data.patientName} />
            <InfoItem label="Patient Code" value={data.patientCode} />

            {data.doctorId && data.doctorName && (
              <InfoItem label="Doctor" value={data.doctorName} />
            )}

            {data.doctorCode && (
              <InfoItem label="Doctor Code" value={data.doctorCode} />
            )}

            {data.appointmentId && (
              <InfoItem label="Appointment Code" value={data.appointmentCode} />
            )}

            <InfoItem
              label="Last Updated"
              value={dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm")}
            />
          </div>
        </section>

        {/* Items */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Bill Items
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-right">Qty</th>
                  <th className="px-3 py-2 text-right">Unit</th>
                  <th className="px-3 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
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
          </div>
        </section>

        {/* Summary */}
        <section className="bg-slate-50 border rounded-xl p-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{data.subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{data.tax}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- ₹{data.discount}</span>
          </div>

          <div className="flex justify-between font-semibold text-base border-t pt-2">
            <span>Total</span>
            <span>₹{data.totalAmount}</span>
          </div>

          <div className="flex justify-between text-green-700">
            <span>Amount Paid</span>
            <span>₹{data.amountPaid}</span>
          </div>

          <div className="flex justify-between text-red-600">
            <span>Balance</span>
            <span>₹{data.totalAmount - data.amountPaid}</span>
          </div>
        </section>

        {/* Payments */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Payments
          </h3>

          {data.payments.length === 0 && (
            <div className="text-sm text-slate-500 text-center py-4">
              No payments recorded yet.
            </div>
          )}

          {data.payments.length > 0 && (
            <div className="space-y-3">
              {data.payments.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-slate-800">
                      ₹{p.amount} · {p.method}
                    </p>
                    <p className="text-xs text-slate-500">
                      {dayjs(p.paidAt).format("DD/MM/YYYY HH:mm")}
                    </p>
                  </div>

                  {p.reference && (
                    <span className="text-xs text-slate-600">
                      Ref: {p.reference}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default BillDetailsModal;
