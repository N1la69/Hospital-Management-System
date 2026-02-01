import {
  AddBillItemRequest,
  BillingResponse,
  CreateBillRequest,
  PaymentRequestInterface,
} from "@/types/billing";
import api from "../utils/axios";

export function useBilling() {
  const createNewBill = async (
    patientId: string,
    items: AddBillItemRequest[],
    appointmentId?: string,
  ) => {
    const payload: CreateBillRequest = {
      patientId,
      appointmentId,
      items,
    };
    const res = await api.post<BillingResponse>("/api/billing", payload);
    return res.data;
  };

  const addPayment = async (
    billId: string,
    payload: PaymentRequestInterface,
  ) => {
    const res = await api.post<BillingResponse>(
      `/api/billing/${billId}/payments`,
      payload,
    );
    return res.data;
  };

  return {
    createNewBill,
    addPayment,
  };
}
