import { useBilling } from "@/lib/hooks/useBilling";
import { AddBillItemRequest } from "@/types/billing";
import BillItemsForm from "./BillItemsForm";
import BillSummary from "./BillSummary";
import PaymentModal from "./PaymentModal";

interface Props {
  patientId: string;
  appointmentId?: string;
  defaultItems?: AddBillItemRequest[];
}

const BillingPanel = ({ patientId, appointmentId, defaultItems = [] }: Props) => {
    const { bill, createNewBill, addPayment } = useBilling();

  const handleCreateBill = async (items: AddBillItemRequest[]) => {
    await createNewBill(patientId, items, appointmentId);
  };

  const handleAddPayment = async (billId: string, payload: any) => {
    return addPayment(billId, payload);
  };

  return (
    <div className="space-y-4">
        {!bill && (
        <BillItemsForm
          defaultItems={defaultItems}
          onSubmit={handleCreateBill}
        />
      )}

      {bill && (
        <>
          <BillSummary bill={bill} />
          <PaymentModal bill={bill} onPay={handleAddPayment} />
        </>
      )}
    </div>
  )
}

export default BillingPanel