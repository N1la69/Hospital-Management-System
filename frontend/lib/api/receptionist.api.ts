import {
  CreateReceptionistRequest,
  ReceptionistResponse,
} from "@/types/receptionist";
import api from "../utils/axios";

export const fetchReceptionists = async (): Promise<ReceptionistResponse[]> => {
  try {
    const res = await api.get<ReceptionistResponse[]>("/api/receptionists");
    return res.data;
  } catch (error) {
    console.error("Error fetching receptionists: ", error);
    return [];
  }
};

export const createReceptionist = async (
  payload: CreateReceptionistRequest
): Promise<void> => {
  try {
    await api.post("/api/receptionists", payload);
  } catch (error) {
    console.error("Error creating receptionist: ", error);
    return;
  }
};
