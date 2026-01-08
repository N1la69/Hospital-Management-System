export interface ReceptionistResponse {
  id: string;
  receptionistCode: string;
  fullName: string;
  status: string;
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
