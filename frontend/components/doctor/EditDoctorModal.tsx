"use client";

import { useState } from "react";
import Modal from "../ui/Modal";

const EditDoctorModal = ({ open, doctor, onSave, onClose }: any) => {
  const [form, setForm] = useState({ ...doctor });

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Edit Doctor">
      <div className="space-y-3">
        <input
          value={form.firstName}
          onChange={(e) => update("firstName", e.target.value)}
        />
        <input
          value={form.lastName}
          onChange={(e) => update("lastName", e.target.value)}
        />
        <input
          value={form.specialization}
          onChange={(e) => update("specialization", e.target.value)}
        />
        <input
          value={form.qualification}
          onChange={(e) => update("qualification", e.target.value)}
        />
        <input
          value={form.experienceYears}
          onChange={(e) => update("experienceYears", e.target.value)}
        />
        <input
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
        />

        <button
          onClick={() => onSave(form)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditDoctorModal;
