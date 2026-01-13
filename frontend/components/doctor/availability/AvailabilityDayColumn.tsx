"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { formatInstantToLocalTime } from "@/lib/utils/time";
import { DoctorAvailabilityResponse } from "@/types/availability";

interface Props {
  day: string;
  slots: DoctorAvailabilityResponse[];
  onAdd?: (day: string) => void;
}

const AvailabilityDayColumn = ({ day, slots, onAdd }: Props) => {
  const { roles } = useAuth();
  const isAdmin = roles.includes("ADMIN");
  const isDoctor = roles.includes("DOCTOR");

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col min-h-55">
      {/* HEADER BAR */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
        <h3 className="text-sm font-semibold text-slate-800">{day}</h3>

        {(isAdmin || isDoctor) && onAdd && (
          <button
            className="text-xs font-medium text-blue-700 hover:text-blue-900"
            onClick={() => onAdd(day)}
          >
            + Add
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 p-3 space-y-2">
        {slots.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No availability
          </div>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5"
            >
              <div className="text-xs font-medium text-slate-800">
                {formatInstantToLocalTime(slot.startTime)} –{" "}
                {formatInstantToLocalTime(slot.endTime)}
              </div>
              <div className="text-[11px] text-slate-500">
                Slot: {slot.slotMinutes} min
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvailabilityDayColumn;
