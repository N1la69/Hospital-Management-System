export interface DoctorResponse {
  id: string;
  doctorCode: string;
  fullName: string;
  specialization: string;
  email: string;
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
  phone: string;
  email: string;
  address: string;
  username: string;
  password: string;
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
  qualification?: string;
  experienceYears?: number;
}
