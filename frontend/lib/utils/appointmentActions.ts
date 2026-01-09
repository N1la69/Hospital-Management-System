import { AppointmentStatus } from "@/types/appointment";

export const canCheckIn = (roles: string[], status: AppointmentStatus) => {
  return (
    (roles.includes("RECEPTIONIST") || roles.includes("ADMIN")) &&
    status === "SCHEDULED"
  );
};

export const canStart = (roles: string[], status: AppointmentStatus) => {
  return (
    (roles.includes("RECEPTIONIST") || roles.includes("ADMIN")) &&
    status === "CHECKED_IN"
  );
};

export const canComplete = (roles: string[], status: AppointmentStatus) => {
  return (
    (roles.includes("RECEPTIONIST") || roles.includes("ADMIN")) &&
    status === "IN_PROGRESS"
  );
};

export const canCancel = (roles: string[], status: AppointmentStatus) => {
  if (roles.includes("ADMIN")) return true;
  return roles.includes("RECEPTIONIST") && status === "SCHEDULED";
};

export const canNoShow = (roles: string[], status: AppointmentStatus) => {
  return (
    (roles.includes("RECEPTIONIST") || roles.includes("ADMIN")) &&
    status === "SCHEDULED"
  );
};
