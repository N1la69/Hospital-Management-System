export interface BillItem {
  description: string;
  type: "CONSULTATION" | "PROCEDURE" | "LAB_TEST" | "MEDICINE" | "OTHER";
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
  reference?: string;
}

export interface AddBillItemRequest {
  description: string;
  type: "CONSULTATION" | "PROCEDURE" | "LAB_TEST" | "MEDICINE" | "OTHER";
  quantity: number;
  unitPrice: number;
}

export interface PaymentRequestInterface {
  amount: number;
  method: string;
  reference?: string;
}

export interface CreateBillRequest {
  patientId: string;
  appointmentId?: string;
  items: AddBillItemRequest[];
}

export interface BillingResponse {
  id: string;
  billNumber: string;
  patientId: string;
  patientCode: string;
  patientName: string;
  appointmentId: string;
  appointmentCode: string;
  doctorId: string;
  doctorCode: string;
  doctorName: string;
  items: BillItem[];
  subtotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  amountPaid: number;
  status: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "CANCELLED";
  updatedAt: string;
  payments: Payment[];
}

export interface BillSearchFilter {
  name?: string;
  paymentStatus?: "UNPAID" | "PAID" | "PARTIALLY_PAID" | "CANCELLED";
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
}
