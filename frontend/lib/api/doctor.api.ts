import { CreateDoctorRequest, DoctorResponse } from "@/types/doctor";
import api from "../utils/axios";

export const fetchDoctors = async (): Promise<DoctorResponse[]> => {
  try {
    const res = await api.get<DoctorResponse[]>("/api/doctors");
    return res.data;
  } catch (error) {
    console.log("Error fetching doctors:", error);
    return [];
  }
};

export const createDoctor = async (
  payload: CreateDoctorRequest
): Promise<void> => {
  try {
    await api.post("/api/doctors", payload);
  } catch (error) {
    console.error("Error creating doctor: ", error);
    return;
  }
};
