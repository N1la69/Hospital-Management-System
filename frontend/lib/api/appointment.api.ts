import { AppointmentResponse } from "@/types/appointment";
import api from "../utils/axios";

export const fetchAppointments = async (): Promise<AppointmentResponse[]> => {
  try {
    const res = await api.get<AppointmentResponse[]>("/api/appointments");
    return res.data;
  } catch (error) {
    console.log("Error fetching appointments: ", error);
    return [];
  }
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
