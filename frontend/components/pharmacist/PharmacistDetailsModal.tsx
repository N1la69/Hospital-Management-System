"use client";

import { PharmacistResponse } from "@/types/pharmacist";
import Modal from "../ui/Modal";
import InfoItem from "../ui/InfoItem";

interface Props {
  open: boolean;
  data: PharmacistResponse | null;
  onClose: () => void;
}

const PharmacistDetailsModal = ({ open, data, onClose }: Props) => {
  if (!data) return null;

  return (
    <Modal open={open} onClose={onClose} title="Pharmacist Details" size="lg">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {data.fullName}
            </h2>
            <p className="text-sm text-slate-500">
              Pharmacist Code: {data.pharmacistCode}
            </p>
          </div>
        </div>

        {/* INFO */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Pharmacist Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Email" value={data.email} />
            <InfoItem label="Phone" value={data.phone} />
            <InfoItem label="Address" value={data.address} full />
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default PharmacistDetailsModal;
