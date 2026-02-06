export type MedicineCategory =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "INJECTION"
  | "OINTMENT"
  | "DROPS"
  | "OTHER";

export interface AddMedicineRequest {
  name: string;
  manufacturer: string;
  category: MedicineCategory;
  cgstPercent: number;
  sgstPercent: number;
  sellingPrice: number;
  reorderLevel: number;
}

export interface AddStockRequest {
  medicineId: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
}

export interface MedicineResponse {
  id: string;
  name: string;
  manufacturer: string;
  category: MedicineCategory;
  cgstPercent: number;
  sgstPercent: number;
  sellingPrice: number;
  reorderLevel: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateMedicineRequest {
  name: string;
  manufacturer: string;
  category: MedicineCategory;
  cgstPercent: number;
  sgstPercent: number;
  sellingPrice: number;
  reorderLevel: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface MedicineSearchFilter {
  name?: string;
  category?: MedicineCategory;
  status?: "ACTIVE" | "INACTIVE";
}
