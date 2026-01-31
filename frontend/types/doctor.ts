import { DoctorAvailabilityResponse } from "./availability";

export interface DoctorResponse {
  id: string;
  doctorCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFees: number;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  specialization:
    | "CARDIOLOGY"
    | "NEUROLOGY"
    | "ORTHOPEDICS"
    | "PEDIATRICS"
    | "GENERAL_MEDICINE"
    | "DERMATOLOGY"
    | "PSYCHIATRY";
  qualification: string;
  experienceYears: number;
  consultationFees: number;
  phone: string;
  email: string;
  address: string;
  username: string;
  password: string;
}

export interface UpdateDoctorRequest {
  firstName: string;
  lastName: string;
  specialization:
    | "CARDIOLOGY"
    | "NEUROLOGY"
    | "ORTHOPEDICS"
    | "PEDIATRICS"
    | "GENERAL_MEDICINE"
    | "DERMATOLOGY"
    | "PSYCHIATRY";
  qualification: string;
  experienceYears: number;
  consultationFees: number;
  phone: string;
  email: string;
  address: string;
}

export interface DoctorDetailsResponse {
  doctor: DoctorResponse;
  availability: DoctorAvailabilityResponse[];
}

export interface DoctorSearchFilter {
  name?: string;
  doctorCode?: string;
  email?: string;
  specialization?:
    | "CARDIOLOGY"
    | "NEUROLOGY"
    | "ORTHOPEDICS"
    | "PEDIATRICS"
    | "GENERAL_MEDICINE"
    | "DERMATOLOGY"
    | "PSYCHIATRY";
  status?: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
  availableDay?:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  qualification?: string;
  experienceYears?: number;
}
