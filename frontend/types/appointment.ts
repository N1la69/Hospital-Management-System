export type AppointmentStatus =
  | "SCHEDULED"
  | "CHECKED_IN"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface AppointmentResponse {
  id: string;
  appointmentCode: string;
  patientId: string;
  doctorId: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: AppointmentStatus;
}

export interface CreateAppointmentRequest {
  patientId: string;
  doctorId: string;
  scheduledStart: string;
  scheduledEnd: string;
  reason: string;
}
