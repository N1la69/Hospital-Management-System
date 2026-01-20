"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

const EditPatientModal = ({ open, patient, onSave, onClose }: any) => {
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    if (patient) setForm(patient);
  }, [patient]);

  const update = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  if (!form) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Patient" size="lg">
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

        {/* Gender */}
        <Field label="Gender">
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value as any)}
            className={inputClass}
          >
            <option value="">Select gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Others</option>
          </select>
        </Field>

        {/* DOB */}
        <Field label="Date of Birth">
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => update("dateOfBirth", e.target.value as any)}
            className={inputClass}
          />
        </Field>

        {/* Blood Group */}
        <Field label="Blood Group">
          <select
            value={form.bloodGroup}
            onChange={(e) => update("bloodGroup", e.target.value as any)}
            className={inputClass}
          >
            <option value="">Select blood group</option>
            <option value="A_POS">A+</option>
            <option value="A_NEG">A-</option>
            <option value="B_POS">B+</option>
            <option value="B_NEG">B-</option>
            <option value="O_POS">O+</option>
            <option value="O_NEG">O-</option>
            <option value="AB_POS">AB+</option>
            <option value="AB_NEG">AB-</option>
          </select>
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

export default EditPatientModal;
