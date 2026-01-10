"use client";

import { createReceptionist } from "@/lib/api/receptionist.api";
import { CreateReceptionistRequest } from "@/types/receptionist";
import { useState } from "react";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateReceptionistModal = ({ open, onClose, onSuccess }: Props) => {
  const [form, setForm] = useState<Partial<CreateReceptionistRequest>>({});
  const [loading, setLoading] = useState(false);

  function update<K extends keyof CreateReceptionistRequest>(
    key: K,
    value: CreateReceptionistRequest[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const submit = async () => {
    setLoading(true);
    try {
      await createReceptionist(form as CreateReceptionistRequest);

      onSuccess();
      onClose();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create receptionist";

      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Receptionist" size="lg">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="First Name"
          onChange={(e) => update("firstName", e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          onChange={(e) => update("lastName", e.target.value)}
        />

        <input
          placeholder="Phone"
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          placeholder="Email"
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          placeholder="Address"
          onChange={(e) => update("address", e.target.value)}
        />

        <hr className="my-2" />

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => update("username", e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => update("password", e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="px-4 py-2 border">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-black text-white"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateReceptionistModal;
