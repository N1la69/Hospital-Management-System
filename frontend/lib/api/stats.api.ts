import { AdminStats } from "@/types/stats";
import api from "../utils/axios";

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const res = await api.get("/api/admin/stats");
  return res.data;
};
