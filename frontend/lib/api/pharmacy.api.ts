import {
  AddMedicineRequest,
  AddStockRequest,
  MedicineSearchFilter,
  UpdateMedicineRequest,
} from "@/types/pharmacy";
import api from "../utils/axios";

// MEDICINES
export const createMedicine = async (payload: AddMedicineRequest) => {
  const res = await api.post("/api/pharmacy/medicines", payload);
  return res.data;
};

export const updateMedicine = async (
  medicineId: string,
  payload: UpdateMedicineRequest,
) => {
  const res = await api.put(`/api/pharmacy/medicines/${medicineId}`, payload);
  return res.data;
};

export const getMedicineById = async (medicineId: string) => {
  const res = await api.get(`/api/pharmacy/medicines/${medicineId}`);
  return res.data;
};

export const searchMedicines = async (
  filter: MedicineSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/pharmacy/medicines/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};

// STOCK MANAGEMENT
export const addStock = async (payload: AddStockRequest) => {
  await api.post("/api/pharmacy/stock", payload);
};

// DISPENSE FROM BILL
export const dispenseByBill = async (billId: string) => {
  const res = await api.post(`/api/pharmacy/dispense/${billId}`);
  return res.data;
};

// ALERTS
export const expiryAlerts = async () => {
  const res = await api.get("/api/pharmacy/alerts/expiry");
  return res.data;
};

export const lowStockAlerts = async () => {
  const res = await api.get("/api/pharmacy/alerts/low-stock");
  return res.data;
};
