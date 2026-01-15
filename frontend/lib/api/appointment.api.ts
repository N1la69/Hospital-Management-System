import {
  AppointmentResponse,
  CreateAppointmentRequest,
} from "@/types/appointment";
import api from "../utils/axios";

export const fetchAppointments = async (): Promise<AppointmentResponse[]> => {
  const res = await api.get<AppointmentResponse[]>("/api/appointments");
  return res.data;
};

export const bookAppointments = async (
  payload: CreateAppointmentRequest
): Promise<void> => {
  await api.post("/api/appointments", payload);
};

export const fetchMyAppointments = async (): Promise<AppointmentResponse[]> => {
  const res = await api.get("/api/appointments/my");
  return res.data;
};

export const checkInAppointment = async (id: string) => {
  await api.post(`/api/appointments/${id}/check-in`);
};

export const startAppointment = async (id: string) => {
  await api.post(`/api/appointments/${id}/start`);
};

export const completeAppointment = async (id: string) => {
  await api.post(`/api/appointments/${id}/complete`);
};

export const cancelAppointment = async (id: string, reason: string) => {
  await api.post(`/api/appointments/${id}/cancel`, { reason });
};

export const markNoShow = async (id: string) => {
  await api.post(`/api/appointments/${id}/no-show`);
};
