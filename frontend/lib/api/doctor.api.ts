import {
  CreateDoctorRequest,
  DoctorResponse,
  DoctorSearchFilter,
  UpdateDoctorRequest,
} from "@/types/doctor";
import api from "../utils/axios";
import { SimpleOption } from "@/types/options";
import {
  DoctorPatientRowResponse,
  DoctorPatientSearchFilter,
} from "@/types/appointment";
import { PageResponse } from "@/types/pagination";

export const fetchDoctors = async (): Promise<DoctorResponse[]> => {
  const res = await api.get<DoctorResponse[]>("/api/doctors");
  return res.data;
};

export const createDoctor = async (
  payload: CreateDoctorRequest,
): Promise<void> => {
  await api.post("/api/doctors", payload);
};

export const updateDoctor = async (
  doctorId: string,
  payload: UpdateDoctorRequest,
): Promise<void> => {
  await api.put(`/api/doctors/${doctorId}`, payload);
};

export const deleteDoctor = async (doctorId: string): Promise<void> => {
  await api.delete(`/api/doctors/${doctorId}`);
};

export const searchDoctors = async (
  filter: DoctorSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/doctors/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};

export const getDoctorDetails = async (doctorId: string) => {
  const res = await api.get(`/api/doctors/${doctorId}/details`);
  return res.data;
};

export const getMyDoctorProfile = async () => {
  const res = await api.get("/api/doctors/me");
  return res.data;
};

export const searchMyPatients = async (
  payload: DoctorPatientSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/doctors/me/patients/search?page=${page}&size=${size}`,
    payload,
  );
  return res.data;
};

export const fetchDoctorOptions = async (): Promise<SimpleOption[]> => {
  const res = await api.get<SimpleOption[]>("/api/doctors/options");
  return res.data;
};
