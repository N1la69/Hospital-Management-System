import {
  CreateReceptionistRequest,
  ReceptionistResponse,
  ReceptionistSearchFilter,
} from "@/types/receptionist";
import api from "../utils/axios";

export const fetchReceptionists = async (): Promise<ReceptionistResponse[]> => {
  const res = await api.get<ReceptionistResponse[]>("/api/receptionists");
  return res.data;
};

export const createReceptionist = async (
  payload: CreateReceptionistRequest
): Promise<void> => {
  await api.post("/api/receptionists", payload);
};

export const searchReceptionists = async (
  filter: ReceptionistSearchFilter,
  page: number,
  size: number
) => {
  const res = await api.post(
    `/api/receptionists/search?page=${page}&size=${size}`,
    filter
  );
  return res.data;
};
