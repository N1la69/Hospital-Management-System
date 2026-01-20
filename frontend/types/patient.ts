export interface PatientResponse {
  id: string;
  patientCode: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  email: string;
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
  createLogin: boolean;
  username?: string;
  password?: string;
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
