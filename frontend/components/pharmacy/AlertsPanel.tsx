"use client";

import { expiryAlerts, lowStockAlerts } from "@/lib/api/pharmacy.api";
import { useEffect, useState } from "react";

const AlertsPanel = () => {
  const [expiry, setExpiry] = useState<string[]>([]);
  const [low, setLow] = useState<string[]>([]);

  useEffect(() => {
    expiryAlerts().then(setExpiry);
    lowStockAlerts().then(setLow);
  }, []);

  if (expiry.length === 0 && low.length === 0) return null;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {expiry.length > 0 && (
        <div className="border rounded-xl p-4 bg-amber-50">
          <h3 className="font-semibold mb-2">Expiring Soon</h3>
          <ul className="text-sm space-y-1">
            {expiry.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {low.length > 0 && (
        <div className="border rounded-xl p-4 bg-red-50">
          <h3 className="font-semibold mb-2">Low Stock</h3>
          <ul className="text-sm space-y-1">
            {low.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
