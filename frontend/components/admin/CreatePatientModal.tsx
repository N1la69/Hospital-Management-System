"use client";

import { createPatient } from "@/lib/api/patient.api";
import { CreatePatientRequest } from "@/types/patient";
import { useState } from "react";
import Modal from "../ui/Modal";

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
    } catch (error) {
      console.log("Error in submitting patient request: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Patient" size="lg">
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

        <select onChange={(e) => update("gender", e.target.value as any)}>
          <option value="">Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          type="date"
          onChange={(e) => update("dateOfBirth", e.target.value)}
        />

        <select onChange={(e) => update("bloodGroup", e.target.value as any)}>
          <option value="">Blood Group</option>
          <option value="A_POS">A+</option>
          <option value="A_NEG">A-</option>
          <option value="B_POS">B+</option>
          <option value="B_NEG">B-</option>
          <option value="AB_POS">AB+</option>
          <option value="AB_NEG">AB-</option>
          <option value="O_POS">O+</option>
          <option value="O_NEG">O-</option>
        </select>

        <input
          placeholder="Phone"
          onChange={(e) => update("phone", e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => update("email", e.target.value)}
        />
        <input
          type="text"
          placeholder="Address"
          onChange={(e) => update("address", e.target.value)}
        />

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

export default CreatePatientModal;
