import {
  CreateDoctorRequest,
  DoctorResponse,
  DoctorSearchFilter,
} from "@/types/doctor";
import api from "../utils/axios";
import { SimpleOption } from "@/types/options";

export const fetchDoctors = async (): Promise<DoctorResponse[]> => {
  const res = await api.get<DoctorResponse[]>("/api/doctors");
  return res.data;
};

export const getMyDoctorProfile = async () => {
  const res = await api.get("/api/doctors/me");
  return res.data;
};

export const createDoctor = async (
  payload: CreateDoctorRequest
): Promise<void> => {
  await api.post("/api/doctors", payload);
};

export const searchDoctors = async (
  filter: DoctorSearchFilter,
  page: number,
  size: number
) => {
  const res = await api.post(
    `/api/doctors/search?page=${page}&size=${size}`,
    filter
  );
  return res.data;
};

export const fetchDoctorOptions = async (): Promise<SimpleOption[]> => {
  const res = await api.get<SimpleOption[]>("/api/doctors/options");
  return res.data;
};
