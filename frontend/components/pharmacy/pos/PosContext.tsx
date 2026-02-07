"use client";

import { createContext, useContext, useState } from "react";
import { MedicineResponse } from "@/types/pharmacy";

export interface PosItem {
  medicine: MedicineResponse;
  qty: number;
}

interface PosContextType {
  items: PosItem[];
  add: (m: MedicineResponse, qty?: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const PosContext = createContext<PosContextType>(null!);

export const usePos = () => useContext(PosContext);

export const PosProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<PosItem[]>([]);

  const add = (m: MedicineResponse, qty = 1) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.medicine.id === m.id);

      if (ex) {
        return prev.map((p) =>
          p.medicine.id === m.id ? { ...p, qty: p.qty + qty } : p,
        );
      }

      return [...prev, { medicine: m, qty }];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.medicine.id !== id));

  const clear = () => setItems([]);

  return (
    <PosContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </PosContext.Provider>
  );
};
