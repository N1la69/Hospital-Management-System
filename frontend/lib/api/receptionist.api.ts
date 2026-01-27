import {
  CreateReceptionistRequest,
  ReceptionistResponse,
  ReceptionistSearchFilter,
  UpdateReceptionistRequest,
} from "@/types/receptionist";
import api from "../utils/axios";

export const fetchReceptionists = async (): Promise<ReceptionistResponse[]> => {
  const res = await api.get<ReceptionistResponse[]>("/api/receptionists");
  return res.data;
};

export const createReceptionist = async (
  payload: CreateReceptionistRequest,
): Promise<void> => {
  await api.post("/api/receptionists", payload);
};

export const updateReceptionist = async (
  receptionistId: string,
  payload: UpdateReceptionistRequest,
): Promise<void> => {
  await api.put(`/api/receptionists/${receptionistId}`, payload);
};

export const deleteReceptionist = async (
  receptionistId: string,
): Promise<void> => {
  await api.delete(`/api/receptionists/${receptionistId}`);
};

export const getReceptionistDetails = async (receptionistId: string) => {
  const res = await api.get<ReceptionistResponse>(
    `/api/receptionists/${receptionistId}/details`,
  );
  return res.data;
};

export const searchReceptionists = async (
  filter: ReceptionistSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/receptionists/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};
