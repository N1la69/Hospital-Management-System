import { CreatePatientRequest, PatientResponse } from "@/types/patient";
import api from "../utils/axios";

export const fetchPatients = async (): Promise<PatientResponse[]> => {
  try {
    const res = await api.get<PatientResponse[]>("/api/patients");
    return res.data;
  } catch (error) {
    console.log("Error fecthing patients:", error);
    return [];
  }
};

export const createPatient = async (
  payload: CreatePatientRequest
): Promise<void> => {
  try {
    await api.post("/api/patients", payload);
  } catch (error) {
    console.error("Error creating patient: ", error);
    return;
  }
};
