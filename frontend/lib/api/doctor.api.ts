import { DoctorResponse } from "@/types/doctor";
import api from "./axios";

export async function fetchDoctors(): Promise<DoctorResponse[]> {
  const res = await api.get<DoctorResponse[]>("/api/doctors");
  return res.data;
}
