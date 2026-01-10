import {
  CreateAvailabilityRequest,
  DoctorAvailabilityResponse,
} from "@/types/availability";
import api from "../utils/axios";

export const createAvailability = async (
  payload: CreateAvailabilityRequest
): Promise<void> => {
  await api.post("/api/doctors/availability", payload);
};

export const getDoctorAvailability = async (
  doctorId: string
): Promise<DoctorAvailabilityResponse[]> => {
  const res = await api.get(`/api/doctors/availability/${doctorId}`);
  return res.data;
};
