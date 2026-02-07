import {
  BillSearchFilter,
  CreateBillRequest,
  PaymentRequestInterface,
} from "@/types/billing";
import api from "../utils/axios";

export const createBill = async (payload: CreateBillRequest) => {
  const res = await api.post("/api/billing", payload);
  return res.data;
};

export const payment = async (
  billId: string,
  payload: PaymentRequestInterface,
) => {
  const res = await api.post(`/api/billing/${billId}/payments`, payload);
  return res.data;
};

export const cancelBill = async (billId: string): Promise<void> => {
  await api.post(`/api/billing/${billId}/cancel`);
};

export const getBillDetails = async (billId: string) => {
  const res = await api.get(`/api/billing/${billId}/details`);
  return res.data;
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
