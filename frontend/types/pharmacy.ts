export type MedicineCategory =
  | "TABLET"
  | "CAPSULE"
  | "SYRUP"
  | "INJECTION"
  | "OINTMENT"
  | "DROPS"
  | "OTHER";

export interface AddMedicineRequest {
  medicineName: string;
  manufacturerName: string;
  category: MedicineCategory;
  sellingPrice: number;
  reorderLevel: number;
}

export interface AddStockRequest {
  medicineId: string;
  mfgDate: string;
  expiryDate: string;
  quantity: number;
  costPrice: number;
  supplier: string;
}

export interface MedicineResponse {
  id: string;
  medicineName: string;
  medicineCode: string;
  manufacturerName: string;
  category: MedicineCategory;
  sellingPrice: number;
  reorderLevel: number;
  status: "ACTIVE" | "EXPIRED";
}

export interface InventoryResponse {
  medicineId: string;
  batchNo: string;
  mfgDate: string;
  expiryDate: string;
  quantityAvailable: number;
  supplier: string;
}

export interface MedicineStockResponse {
  medicine: MedicineResponse;
  stock: InventoryResponse;
}

export interface UpdateMedicineRequest {
  medicineName: string;
  manufacturerName: string;
  category: MedicineCategory;
  sellingPrice: number;
  reorderLevel: number;
  status: "ACTIVE" | "EXPIRED";
}

export interface MedicineSearchFilter {
  name?: string;
  category?: MedicineCategory;
  status?: "ACTIVE" | "EXPIRED";
}
