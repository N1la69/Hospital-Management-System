import { AuthResponse, LoginRequest } from "@/types/auth";
import api from "../utils/axios";

export async function loginApi(payload: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/api/auth/login", payload);
  return res.data;
}
