import { PatientResponse } from "@/types/patient";
import api from "./axios";

export async function fetchPatients(): Promise<PatientResponse[]> {
  try {
    const res = await api.get<PatientResponse[]>("/api/patients");
    return res.data;
  } catch (error) {
    console.log("Error fecthing patients:", error);
    return [];
  }
}
