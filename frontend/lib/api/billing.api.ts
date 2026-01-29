import { CreateBillRequest } from "@/types/billing";
import api from "../utils/axios";

export const createBill = async (payload: CreateBillRequest) => {
  await api.post("/api/billing", payload);
};

export const payment = async (
  billId: string,
  payload: PaymentRequest,
): Promise<void> => {
  await api.post(`/api/billing/${billId}/payments`, payload);
};

export const cancelBill = async (billId: string): Promise<void> => {
  await api.post(`/api/billing/${billId}/cancel`);
};
