import {
  CreateMedicalRecordRequest,
  MedicalRecordResponse,
  UpdateMedicalRecordRequest,
} from "@/types/medical-record";
import api from "../utils/axios";

export const createMedicalRecord = async (
  payload: CreateMedicalRecordRequest,
) => {
  const res = await api.post<MedicalRecordResponse>(
    "/api/medical-records",
    payload,
  );
  return res.data;
};

export const updateMedicalRecord = async (
  payload: UpdateMedicalRecordRequest,
) => {
  const res = await api.put<MedicalRecordResponse>(
    "/api/medical-records",
    payload,
  );
  return res.data;
};

export const getMedicalHistoryByPatient = async (patientId: string) => {
  const res = await api.get<MedicalRecordResponse[]>(
    `/api/medical-records/patient/${patientId}`,
  );
  return res.data;
};
