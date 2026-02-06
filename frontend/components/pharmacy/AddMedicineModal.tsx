"use client";

import { createMedicine } from "@/lib/api/pharmacy.api";
import { AddMedicineRequest, MedicineCategory } from "@/types/pharmacy";
import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES: { label: string; value: MedicineCategory }[] = [
  { label: "Tablet", value: "TABLET" },
  { label: "Capsule", value: "CAPSULE" },
  { label: "Syrup", value: "SYRUP" },
  { label: "Injection", value: "INJECTION" },
  { label: "Ointment", value: "OINTMENT" },
  { label: "Drops", value: "DROPS" },
  { label: "Other", value: "OTHER" },
];

const AddMedicineModal = ({ open, onClose, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<AddMedicineRequest>({
    medicineName: "",
    manufacturerName: "",
    category: "TABLET",
    sellingPrice: 0,
    reorderLevel: 10,
  });

  const update = (key: keyof AddMedicineRequest, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = () => {
    if (!form.medicineName.trim()) {
      toast.error("Medicine name is required");
      return false;
    }

    if (!form.manufacturerName.trim()) {
      toast.error("Manufacturer name is required");
      return false;
    }

    if (form.sellingPrice <= 0) {
      toast.error("Selling price must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await createMedicine({
        ...form,
        medicineName: form.medicineName.trim(),
        manufacturerName: form.manufacturerName.trim(),
      });

      onSuccess();
      onClose();

      setForm({
        medicineName: "",
        manufacturerName: "",
        category: "TABLET",
        sellingPrice: 0,
        reorderLevel: 10,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to add medicine",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Medicine" size="md">
      <div className="space-y-5">
        {/* Info */}
        <div className="text-xs text-slate-500">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Medicine Name *"
            onChange={(v) => update("medicineName", v)}
          />

          <Input
            label="Manufacturer Name *"
            onChange={(v) => update("manufacturerName", v)}
          />

          <Select
            label="Category *"
            options={CATEGORIES}
            onChange={(v) => update("category", v)}
          />

          <Input
            label="Selling Price (₹) *"
            type="number"
            onChange={(v) => update("sellingPrice", Number(v))}
          />

          <Input
            label="Reorder Level"
            type="number"
            onChange={(v) => update("reorderLevel", Number(v))}
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
            className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Medicine"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMedicineModal;
