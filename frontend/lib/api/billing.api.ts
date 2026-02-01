import { BillSearchFilter, CreateBillRequest } from "@/types/billing";
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

export const searchBills = async (
  filter: BillSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/billing/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};
