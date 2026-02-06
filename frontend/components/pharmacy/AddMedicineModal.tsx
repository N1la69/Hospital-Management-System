"use client";

import { createMedicine } from "@/lib/api/pharmacy.api";
import { AddMedicineRequest, MedicineCategory } from "@/types/pharmacy";
import { useState } from "react";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMedicineModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<AddMedicineRequest>({
    name: "",
    manufacturer: "",
    category: "TABLET",
    sellingPrice: 0,
    cgstPercent: 0,
    sgstPercent: 0,
    reorderLevel: 10,
  });

  const handleSubmit = async () => {
    await createMedicine(form);
    onSuccess();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Medicine" size="md">
      <div className="space-y-3">
        <input
          className="border p-2 w-full"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Manufacturer"
          onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
        />

        <select
          className="border p-2 w-full"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value as MedicineCategory })
          }
        >
          <option>TABLET</option>
          <option>CAPSULE</option>
          <option>SYRUP</option>
          <option>INJECTION</option>
          <option>OINTMENT</option>
          <option>DROPS</option>
          <option>OTHER</option>
        </select>

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Selling Price"
          onChange={(e) =>
            setForm({ ...form, sellingPrice: Number(e.target.value) })
          }
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            className="border p-2"
            placeholder="CGST %"
            onChange={(e) =>
              setForm({ ...form, cgstPercent: Number(e.target.value) })
            }
          />

          <input
            type="number"
            className="border p-2"
            placeholder="SGST %"
            onChange={(e) =>
              setForm({ ...form, sgstPercent: Number(e.target.value) })
            }
          />
        </div>

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Reorder Level"
          onChange={(e) =>
            setForm({ ...form, reorderLevel: Number(e.target.value) })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default AddMedicineModal;
