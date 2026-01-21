"use client";

import { createDoctor } from "@/lib/api/doctor.api";
import { CreateDoctorRequest } from "@/types/doctor";
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

const CreateDoctorModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<Partial<CreateDoctorRequest>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CreateDoctorRequest>(
    key: K,
    value: CreateDoctorRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const submit = async () => {
    setLoading(true);
    try {
      await createDoctor(form as CreateDoctorRequest);

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create doctor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Doctor" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" onChange={(v) => update("firstName", v)} />
        <Input label="Last Name" onChange={(v) => update("lastName", v)} />

        <Select
          label="Specialization"
          onChange={(v) => update("specialization", v as any)}
          options={[
            { label: "Select specialization", value: "" },
            { label: "Cardiology", value: "CARDIOLOGY" },
            { label: "Neurology", value: "NEUROLOGY" },
            { label: "Orthopedics", value: "ORTHOPEDICS" },
            { label: "Pediatrics", value: "PEDIATRICS" },
            { label: "General Medicine", value: "GENERAL_MEDICINE" },
            { label: "Dermatology", value: "DERMATOLOGY" },
            { label: "Psychiatry", value: "PSYCHIATRY" },
          ]}
        />

        <Input
          label="Qualification"
          onChange={(v) => update("qualification", v)}
        />
        <Input
          label="Experience Years"
          type="number"
          onChange={(v) => update("experienceYears", v as number)}
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
          {loading ? "Creating..." : "Create Doctor"}
        </button>
      </div>
    </Modal>
  );
};

export default CreateDoctorModal;
