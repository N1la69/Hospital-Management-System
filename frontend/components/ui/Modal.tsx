"use client";

import { useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
};

const Modal = ({ open, onClose, title, children, size = "md" }: ModalProps) => {
  // PREVENT SCROLL
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC KEY CLOSE
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full ${sizeMap[size]} bg-white rounded-xl shadow-xl border flex flex-col max-h-[95vh]`}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50 rounded-t-xl">
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            <button
              className="text-slate-400 hover:text-slate-700 text-xl leading-none"
              onClick={onClose}
            >
              <IoMdCloseCircle size={18} />
            </button>
          </div>
        )}

        {/* SCROLLABLE CONTENT */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
