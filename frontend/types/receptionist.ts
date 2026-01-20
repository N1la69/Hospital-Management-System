export interface ReceptionistResponse {
  id: string;
  receptionistCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export interface UpdateReceptionistRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export interface CreateReceptionistRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  username: string;
  password: string;
}

export interface ReceptionistSearchFilter {
  name?: string;
  receptionistCode?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
}
