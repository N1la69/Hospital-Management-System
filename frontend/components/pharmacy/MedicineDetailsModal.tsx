"use client";

import { MedicineStockResponse } from "@/types/pharmacy";
import Modal from "../ui/Modal";
import InfoItem from "../ui/InfoItem";

interface Props {
  open: boolean;
  data: MedicineStockResponse | null;
  onClose: () => void;
}

const MedicineDetailsModal = ({ open, data, onClose }: Props) => {
  if (!data) return null;

  const { medicine, stock } = data;

  return (
    <Modal open={open} onClose={onClose} title="Medicine Details" size="lg">
      <div className="space-y-6">
        {/* Medicine Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {medicine.medicineName}
            </h2>
            <p className="text-sm text-slate-500">
              Medicine Code: {medicine.medicineCode}
            </p>
          </div>
        </div>

        {/* Medicine Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Medicine Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Manufacturer" value={medicine.manufacturerName} />
            <InfoItem label="Category" value={medicine.category} />
            <InfoItem
              label="Selling Price"
              value={`₹${medicine.sellingPrice}`}
            />
          </div>
        </section>

        {/* Stock Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Stock Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem label="Latest Batch No." value={stock.batchNo} />
            <InfoItem
              label="Batch Mfg."
              value={new Date(stock.mfgDate).toLocaleDateString("en-GB")}
            />
            <InfoItem
              label="Batch Expiry"
              value={new Date(stock.expiryDate).toLocaleDateString("en-GB")}
            />
            <InfoItem
              label="Quantity Available"
              value={stock.quantityAvailable}
            />
            <InfoItem label="Supplier" value={stock.supplier} />
          </div>
        </section>
      </div>
    </Modal>
  );
};

export default MedicineDetailsModal;
