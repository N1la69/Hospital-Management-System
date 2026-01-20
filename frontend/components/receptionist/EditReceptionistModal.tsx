"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

const EditReceptionistModal = ({
  open,
  receptionist,
  onSave,
  onClose,
}: any) => {
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (receptionist) setForm(receptionist);
  }, [receptionist]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  if (!form) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Receptionist" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <Field label="First Name">
          <input
            value={form.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Last Name */}
        <Field label="Last Name">
          <input
            value={form.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Phone */}
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Email */}
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </Field>

        {/* Address */}
        <Field label="Address" className="md:col-span-2">
          <input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <button
          onClick={onClose}
          className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          onClick={() => onSave(form)}
          className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default EditReceptionistModal;
