import {
  CreatePatientRequest,
  PatientResponse,
  PatientSearchFilter,
  UpdatePatientRequest,
} from "@/types/patient";
import api from "../utils/axios";
import { SimpleOption } from "@/types/options";

export const fetchPatients = async (): Promise<PatientResponse[]> => {
  const res = await api.get<PatientResponse[]>("/api/patients");
  return res.data;
};

export const createPatient = async (
  payload: CreatePatientRequest,
): Promise<void> => {
  await api.post("/api/patients", payload);
};

export const updatePatient = async (
  patientId: string,
  payload: UpdatePatientRequest,
): Promise<void> => {
  await api.put(`/api/patients/${patientId}`, payload);
};

export const deletePatient = async (patientId: string): Promise<void> => {
  await api.delete(`/api/patients/${patientId}`);
};

export const searchPatients = async (
  filter: PatientSearchFilter,
  page: number,
  size: number,
) => {
  const res = await api.post(
    `/api/patients/search?page=${page}&size=${size}`,
    filter,
  );
  return res.data;
};

export const fetchPatientOptions = async (): Promise<SimpleOption[]> => {
  const res = await api.get<SimpleOption[]>("/api/patients/options");
  return res.data;
};
