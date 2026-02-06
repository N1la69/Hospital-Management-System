"use client";

import { expiryAlerts, lowStockAlerts } from "@/lib/api/pharmacy.api";
import { useEffect, useState } from "react";
import { FiAlertTriangle, FiPackage } from "react-icons/fi";

const AlertCard = ({
  title,
  items,
  variant,
  icon,
}: {
  title: string;
  items: string[];
  variant: "warning" | "danger";
  icon: React.ReactNode;
}) => {
  const colors =
    variant === "warning"
      ? {
          bg: "bg-amber-50",
          border: "border-amber-200",
          title: "text-amber-800",
          badge: "bg-amber-100 text-amber-700",
        }
      : {
          bg: "bg-red-50",
          border: "border-red-200",
          title: "text-red-800",
          badge: "bg-red-100 text-red-700",
        };

  return (
    <div
      className={`border rounded-xl p-5 ${colors.bg} ${colors.border} shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={colors.title}>{icon}</span>
          <h3 className={`font-semibold ${colors.title}`}>{title}</h3>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${colors.badge}`}
        >
          {items.length}
        </span>
      </div>

      {/* List */}
      <ul className="text-sm space-y-2">
        {items.map((e, i) => (
          <li
            key={i}
            className="bg-white rounded-md px-3 py-2 border hover:shadow-sm transition line-clamp-2"
          >
            {e}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AlertsPanel = () => {
  const [expiry, setExpiry] = useState<string[]>([]);
  const [low, setLow] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([expiryAlerts(), lowStockAlerts()])
      .then(([exp, low]) => {
        setExpiry(exp || []);
        setLow(low || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
        Checking pharmacy alerts...
      </div>
    );
  }

  if (expiry.length === 0 && low.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-6 text-center text-sm text-slate-500">
        🎉 All good — no stock or expiry alerts
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {expiry.length > 0 && (
        <AlertCard
          title="Medicines Expiring Soon"
          items={expiry}
          variant="warning"
          icon={<FiAlertTriangle size={18} />}
        />
      )}

      {low.length > 0 && (
        <AlertCard
          title="Low Stock Medicines"
          items={low}
          variant="danger"
          icon={<FiPackage size={18} />}
        />
      )}
    </div>
  );
};

export default AlertsPanel;
