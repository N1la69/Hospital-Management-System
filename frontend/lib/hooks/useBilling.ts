import {
  AddBillItemRequest,
  BillingResponse,
  CreateBillRequest,
} from "@/types/billing";
import { useState } from "react";
import { toast } from "react-toastify";
import { cancelBill } from "../api/billing.api";
import api from "../utils/axios";

export function useBilling() {
  const [bill, setBill] = useState<BillingResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const createNewBill = async (
    patientId: string,
    items: AddBillItemRequest[],
    appointmentId?: string,
  ) => {
    setLoading(true);

    try {
      const payload: CreateBillRequest = {
        patientId,
        appointmentId,
        items,
      };
      //   const res = await createBill(payload);
      const res = await api.post<BillingResponse>("/api/billing", payload);
      setBill(res.data);
      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create bill",
      );
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (billId: string, payload: PaymentRequest) => {
    const res = await api.post<BillingResponse>(
      `/api/billing/${billId}/payments`,
      payload,
    );
    setBill(res.data);
    return res.data;
  };

  const cancelCurrentBill = async (billId: string) => {
    await cancelBill(billId);
    setBill(null);
  };

  return { bill, loading, createNewBill, addPayment, cancelCurrentBill };
}
