"use client";

import { useAuth } from "@/lib/auth/AuthContext";
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
    <div className="border rounded-lg p-3 flex flex-col gap-3 min-h-45">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{day}</h3>

        {(isAdmin || isDoctor) && onAdd && (
          <button
            className="text-sm text-blue-600 hover:underline"
            onClick={() => {
              onAdd(day);
            }}
          >
            + Add
          </button>
        )}
      </div>

      {/* SLOTS */}
      {slots.length === 0 ? (
        <p className="text-sm text-gray-400">No Availability</p>
      ) : (
        <div className="flex flex-col gap-2">
          {slots.map((slot) => (
            <div
              className="border rounded-md px-2 py-1 text-sm bg-gray-50"
              key={slot.id}
            >
              <div>
                {slot.startTime} – {slot.endTime}
              </div>
              <div className="text-xs text-gray-500">
                Slot: {slot.slotMinutes} min
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailabilityDayColumn;
