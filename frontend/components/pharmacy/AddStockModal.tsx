"use client";

import { addStock } from "@/lib/api/pharmacy.api";
import { AddStockRequest } from "@/types/pharmacy";
import { useState } from "react";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  medicineId: string;
}

const AddStockModal = ({ open, onClose, medicineId }: Props) => {
  const [form, setForm] = useState<AddStockRequest>({
    medicineId,
    mfgDate: "",
    expiryDate: "",
    quantity: 0,
    costPrice: 0,
    sellingPrice: 0,
    supplier: "",
  });

  const handleSubmit = async () => {
    await addStock({ ...form, medicineId });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Stock" size="md">
      <div className="space-y-3">
        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, mfgDate: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 w-full"
          onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Quantity"
          onChange={(e) =>
            setForm({ ...form, quantity: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Cost Price"
          onChange={(e) =>
            setForm({ ...form, costPrice: Number(e.target.value) })
          }
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Selling Price"
          onChange={(e) =>
            setForm({ ...form, sellingPrice: Number(e.target.value) })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Supplier"
          onChange={(e) => setForm({ ...form, supplier: e.target.value })}
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Stock
        </button>
      </div>
    </Modal>
  );
};

export default AddStockModal;
