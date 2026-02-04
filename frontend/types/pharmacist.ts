export interface PharmacistResponse {
  id: string;
  pharmacistCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
}

export interface UpdatePharmacistRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
}

export interface CreatePharmacistRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  username: string;
  password: string;
}

export interface PharmacistSearchFilter {
  name?: string;
  pharmacistCode?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
}
