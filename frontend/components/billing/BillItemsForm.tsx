"use client";

import { AddBillItemRequest } from "@/types/billing";
import { useState } from "react";

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
    <div className="border rounded-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold">Bill Items</h2>

      {items.map((item, i) => (
        <div className="grid grid-cols-6 gap-2 items-center" key={i}>
          <input
            className="border p-2 col-span-2"
            placeholder="Description"
            value={item.description}
            onChange={(e) => updateItem(i, "description", e.target.value)}
          />

          <select
            className="border p-2"
            value={item.type}
            onChange={(e) => updateItem(i, "type", e.target.value)}
          >
            {ITEM_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2"
            value={item.quantity}
            onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
          />

          <input
            type="number"
            className="border p-2"
            value={item.unitPrice}
            onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
          />

          <button
            onClick={() => removeItem(i)}
            className="text-red-500 text-sm"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={addRow} className="px-3 py-1 border rounded">
          + Add Item
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          Create Bill
        </button>
      </div>
    </div>
  );
};

export default BillItemsForm;
