"use client";

import { useState } from "react";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const CancelAppointmentModal = ({ open, onClose, onConfirm }: Props) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
    setReason("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Cancel Appointment">
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Please provide a reason for cancelling this appointment.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          placeholder="Enter cancellation reason..."
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm"
          >
            Close
          </button>

          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded text-sm disabled:opacity-50"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CancelAppointmentModal;
