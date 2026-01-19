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
      <div className="space-y-4">
        <p className="text-sm text-slate-700">
          Are you sure you want to delete <b>{doctorName}</b>?
        </p>

        <p className="text-xs text-red-600">
          This will permanently delete:
          <br />• Doctor profile
          <br />• All availability slots
          <br />• Linked user account
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm border rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDoctorModal;
