"use client";

import { AddBillItemRequest } from "@/types/billing";
import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";

interface Props {
  defaultItems?: AddBillItemRequest[];
  onSubmit: (items: AddBillItemRequest[]) => void;
}

const ITEM_TYPES = [
  "CONSULTATION",
  "PROCEDURE",
  "LAB_TEST",
  "MEDICINE",
  "OTHER",
] as const;

const BillItemsForm = ({ defaultItems = [], onSubmit }: Props) => {
  const [items, setItems] = useState<AddBillItemRequest[]>(defaultItems);

  const addRow = () => {
    setItems([
      ...items,
      { description: "", type: "OTHER", quantity: 1, unitPrice: 0 },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof AddBillItemRequest,
    value: any,
  ) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      alert("Add at least one item");
      return;
    }
    onSubmit(items);
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-slate-800">Bill Items</h2>

        <button
          onClick={addRow}
          className="inline-flex gap-1 items-center justify-center rounded-md bg-blue-700 px-2.5 py-1 text-sm font-semibold text-white hover:bg-blue-800 transition"
        >
          <span>
            <IoAddCircle size={15} />
          </span>{" "}
          Add Item
        </button>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-6 gap-2 text-xs font-semibold text-slate-500">
        <div className="col-span-2">Description</div>
        <div>Type</div>
        <div>Qty</div>
        <div>Unit ₹</div>
        <div />
      </div>

      {items.map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-6 gap-2 items-center bg-slate-50 p-2 rounded-lg"
        >
          <input
            className="col-span-2 rounded-md border px-2 py-1 text-sm"
            placeholder="Consultation / Test / Medicine"
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
          />

          <select
            className="rounded-md border px-2 py-1 text-sm"
            value={item.type}
            onChange={(e) => updateItem(i, "type", e.target.value)}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            className="rounded-md border px-2 py-1 text-sm"
            value={item.quantity}
            min={1}
            onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
          />

          <input
            type="number"
            className="rounded-md border px-2 py-1 text-sm"
            value={item.unitPrice}
            min={0}
            onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
          />

          <button
            onClick={() => removeItem(i)}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex justify-end pt-3 border-t">
        <button
          onClick={handleSubmit}
          className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Create Bill
        </button>
      </div>
    </div>
  );
};

export default BillItemsForm;
