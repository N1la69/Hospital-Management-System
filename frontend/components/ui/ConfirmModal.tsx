"use client";

import Modal from "./Modal";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  onClose,
  onConfirm,
}: Props) => {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="border px-4 py-2">
          Cancel
        </button>
        <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2">
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
