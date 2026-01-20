"use client";

import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  doctorName: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}

const DeleteDoctorModal = ({
  open,
  doctorName,
  onConfirm,
  onClose,
  loading,
}: Props) => {
  return (
    <Modal open={open} onClose={onClose} title="Delete Doctor" size="sm">
      <div className="space-y-5">
        {/* Main message */}
        <p className="text-sm text-slate-800">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{doctorName}</span>?
        </p>

        {/* Warning box */}
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium mb-2">This action cannot be undone.</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Doctor profile will be permanently deleted</li>
            <li>All availability slots will be removed</li>
            <li>Linked user account will be deleted</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete Doctor"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDoctorModal;
