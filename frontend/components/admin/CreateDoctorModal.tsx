"use client";

import { createDoctor } from "@/lib/api/doctor.api";
import { CreateDoctorRequest } from "@/types/doctor";
import { useState } from "react";
import Modal from "../ui/Modal";

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
    value: CreateDoctorRequest[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const submit = async () => {
    setLoading(true);
    try {
      await createDoctor(form as CreateDoctorRequest);
      onSuccess();
      onClose();
    } catch (error) {
      console.log("Error in submitting doctor request: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Doctor" size="lg">
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

        <select
          onChange={(e) => update("specialization", e.target.value as any)}
        >
          <option value="">Specialization</option>
          <option value="CARDIOLOGY">Cardiology</option>
          <option value="NEUROLOGY">Neurology</option>
          <option value="ORTHOPEDICS">Orthopedics</option>
          <option value="PEDIATRICS">Pediatrics</option>
          <option value="GENERAL_MEDICINE">General Medicine</option>
          <option value="DERMATOLOGY">Dermatology</option>
          <option value="PSYCHIATRY">Psychiatry</option>
        </select>

        <input
          type="text"
          placeholder="Qualification"
          onChange={(e) => update("qualification", e.target.value)}
        />

        <input
          type="number"
          placeholder="Experience Years"
          onChange={(e) => update("experienceYears", Number(e.target.value))}
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

export default CreateDoctorModal;
