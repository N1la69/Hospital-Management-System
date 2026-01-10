import { CreatePatientRequest, PatientResponse } from "@/types/patient";
import api from "../utils/axios";

export const fetchPatients = async (): Promise<PatientResponse[]> => {
  const res = await api.get<PatientResponse[]>("/api/patients");
  return res.data;
};

export const createPatient = async (
  payload: CreatePatientRequest
): Promise<void> => {
  await api.post("/api/patients", payload);
};
