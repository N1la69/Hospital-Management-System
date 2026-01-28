import { AppointmentResponse } from "./appointment";

export const bloodGroupMapper = {
  A_POS: "A+",
  A_NEG: "A-",
  B_POS: "B+",
  B_NEG: "B-",
  O_POS: "O+",
  O_NEG: "O-",
  AB_POS: "AB+",
  AB_NEG: "AB-",
};

export interface PatientResponse {
  id: string;
  patientCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  status: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  bloodGroup:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "O_POS"
    | "O_NEG"
    | "AB_POS"
    | "AB_NEG";
  phone: string;
  email: string;
  address: string;
}

export interface UpdatePatientRequest {
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  bloodGroup:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "O_POS"
    | "O_NEG"
    | "AB_POS"
    | "AB_NEG";
  phone: string;
  email: string;
  address: string;
}

export interface PatientDetailsResponse {
  patient: PatientResponse;
  lastAppointment: AppointmentResponse | null;
}

export interface PatientSearchFilter {
  name?: string;
  patientCode?: string;
  email?: string;
  bloodGroup?:
    | "A_POS"
    | "A_NEG"
    | "B_POS"
    | "B_NEG"
    | "O_POS"
    | "O_NEG"
    | "AB_POS"
    | "AB_NEG";
  status?: "ACTIVE" | "INACTIVE" | "DECEASED";
  gender?: "MALE" | "FEMALE" | "OTHER";
  dobFrom?: string;
  dobTo?: string;
}
