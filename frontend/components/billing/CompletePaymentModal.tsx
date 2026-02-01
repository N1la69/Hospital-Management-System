"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { BillingResponse } from "@/types/billing";
import PaymentPanel from "./PaymentPanel";
import { useBilling } from "@/lib/hooks/useBilling";
import { toast } from "react-toastify";
import { getBillDetails } from "@/lib/api/billing.api";

interface Props {
  open: boolean;
  billId: string | null;
  onClose: () => void;
}

const CompletePaymentModal = ({ open, billId, onClose }: Props) => {
  const [bill, setBill] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const { addPayment } = useBilling();

  useEffect(() => {
    if (!open || !billId) return;

    setLoading(true);
    getBillDetails(billId)
      .then(setBill)
      .catch(() => toast.error("Failed to load bill"))
      .finally(() => setLoading(false));
  }, [open, billId]);

  const handlePay = (billId: string, payload: any) =>
    addPayment(billId, payload);

  return (
    <Modal open={open} onClose={onClose} title="Complete Payment" size="lg">
      {loading && <p className="text-sm text-slate-500">Loading bill…</p>}

      {!loading && bill && <PaymentPanel bill={bill} onPay={handlePay} />}
    </Modal>
  );
};

export default CompletePaymentModal;
