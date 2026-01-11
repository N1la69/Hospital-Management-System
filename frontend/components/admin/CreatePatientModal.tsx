"use client";

import { createPatient } from "@/lib/api/patient.api";
import { CreatePatientRequest } from "@/types/patient";
import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePatientModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<Partial<CreatePatientRequest>>({
    createLogin: true,
  });
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CreatePatientRequest>(
    key: K,
    value: CreatePatientRequest[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const submit = async () => {
    setLoading(true);
    try {
      await createPatient(form as CreatePatientRequest);

      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create patient";

      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Patient" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" onChange={(v) => update("firstName", v)} />
        <Input label="Last Name" onChange={(v) => update("lastName", v)} />

        <Select
          label="Gender"
          onChange={(v) => update("gender", v as any)}
          options={[
            { label: "Select gender", value: "" },
            { label: "Male", value: "MALE" },
            { label: "Female", value: "FEMALE" },
            { label: "Other", value: "OTHER" },
          ]}
        />

        <Input
          label="Date of Birth"
          type="date"
          onChange={(v) => update("dateOfBirth", v)}
        />

        <Select
          label="Blood Group"
          onChange={(v) => update("bloodGroup", v as any)}
          options={[
            { label: "Select blood group", value: "" },
            { label: "A+", value: "A_POS" },
            { label: "A-", value: "A_NEG" },
            { label: "B+", value: "B_POS" },
            { label: "B-", value: "B_NEG" },
            { label: "AB+", value: "AB_POS" },
            { label: "AB-", value: "AB_NEG" },
            { label: "O+", value: "O_POS" },
            { label: "O-", value: "O_NEG" },
          ]}
        />

        <Input label="Phone" onChange={(v) => update("phone", v)} />
        <Input
          label="Email"
          type="email"
          onChange={(v) => update("email", v)}
        />
        <Input
          label="Address"
          className="md:col-span-2"
          onChange={(v) => update("address", v)}
        />

        <Input label="Username" onChange={(v) => update("username", v)} />
        <Input
          label="Password"
          type="password"
          onChange={(v) => update("password", v)}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md border text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Patient"}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePatientModal;
