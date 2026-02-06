"use client";

import { addStock } from "@/lib/api/pharmacy.api";
import { AddStockRequest } from "@/types/pharmacy";
import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  medicineId: string;
}

const AddStockModal = ({ open, onClose, medicineId }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<AddStockRequest>({
    medicineId,
    mfgDate: "",
    expiryDate: "",
    quantity: 0,
    costPrice: 0,
    supplier: "",
  });

  function update<K extends keyof AddStockRequest>(
    key: K,
    value: AddStockRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const validate = () => {
    if (!form.mfgDate) {
      toast.error("Manufacturing date is required");
      return false;
    }

    if (!form.expiryDate) {
      toast.error("Expiry date is required");
      return false;
    }

    if (new Date(form.expiryDate) <= new Date(form.mfgDate)) {
      toast.error("Expiry date must be after manufacturing date");
      return false;
    }

    if (form.quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return false;
    }

    if (form.costPrice <= 0) {
      toast.error("Cost price must be greater than 0");
      return false;
    }

    if (!form.supplier.trim()) {
      toast.error("Supplier name is required");
      return false;
    }

    return true;
  };

  const dateToInstant = (dateStr: string, endOfDay = false) => {
    const date = new Date(dateStr);
    if (endOfDay) date.setHours(23, 59, 59, 999);
    else date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await addStock({
        ...form,
        supplier: form.supplier.trim(),
        medicineId,

        mfgDate: dateToInstant(form.mfgDate),
        expiryDate: dateToInstant(form.expiryDate),
      });

      toast.success("Stock added successfully");
      onClose();

      setForm({
        medicineId,
        mfgDate: "",
        expiryDate: "",
        quantity: 0,
        costPrice: 0,
        supplier: "",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add stock",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Stock Entry" size="md">
      <div className="space-y-5">
        {/* INFO */}
        <div className="text-xs text-slate-500">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Manufacturing Date *"
            type="date"
            onChange={(v) => update("mfgDate", v)}
          />

          <Input
            label="Expiry Date *"
            type="date"
            onChange={(v) => update("expiryDate", v)}
          />

          <Input
            label="Quantity *"
            type="number"
            onChange={(v) => update("quantity", Number(v))}
          />

          <Input
            label="Cost Price (₹) *"
            type="number"
            onChange={(v) => update("costPrice", Number(v))}
          />

          <Input
            label="Supplier *"
            onChange={(v) => update("supplier", v)}
            className="md:col-span-2"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-green-700 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Stock"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddStockModal;
