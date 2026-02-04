"use client";

import { createPharmacist } from "@/lib/api/pharmacist.api";
import { CreatePharmacistRequest } from "@/types/pharmacist";
import { useState } from "react";
import Modal from "../ui/Modal";
import Input from "../ui/Input";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePharmacistModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<Partial<CreatePharmacistRequest>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CreatePharmacistRequest>(
    key: K,
    value: CreatePharmacistRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const submit = async () => {
    setLoading(true);
    try {
      await createPharmacist(form as CreatePharmacistRequest);

      onSuccess();
      onClose();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create pharmacist",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Pharmacist" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="First Name" onChange={(v) => update("firstName", v)} />
        <Input label="Last Name" onChange={(v) => update("lastName", v)} />

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
          {loading ? "Creating..." : "Create Pharmacist"}
        </button>
      </div>
    </Modal>
  );
};

export default CreatePharmacistModal;
