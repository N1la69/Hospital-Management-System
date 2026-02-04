import {
  CreatePharmacistRequest,
  PharmacistResponse,
  PharmacistSearchFilter,
  UpdatePharmacistRequest,
} from "@/types/pharmacist";
import api from "../utils/axios";

export const fetchPharmacists = async (): Promise<PharmacistResponse[]> => {
  const res = await api.get<PharmacistResponse[]>("/api/pharmacists");
  return res.data;
};

export const createPharmacist = async (
  payload: CreatePharmacistRequest,
): Promise<void> => {
  await api.post("/api/pharmacists", payload);
};

export const updatePharmacist = async (
  pharmacistId: string,
  payload: UpdatePharmacistRequest,
): Promise<void> => {
  await api.put(`/api/pharmacists/${pharmacistId}`, payload);
};

export const deletePharmacist = async (pharmacistId: string): Promise<void> => {
  await api.delete(`/api/pharmacists/${pharmacistId}`);
};

export const getPharmacistDetails = async (pharmacistId: string) => {
  const res = await api.get<PharmacistResponse>(
    `/api/pharmacists/${pharmacistId}/details`,
  );
  return res.data;
};

export const searchPharmacists = async (
  filter: PharmacistSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/pharmacists/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};
