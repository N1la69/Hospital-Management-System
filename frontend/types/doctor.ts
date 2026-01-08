export interface DoctorResponse {
  id: string;
  doctorCode: string;
  fullName: string;
  specialization: string;
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
