"use client";

import { DoctorAvailabilityResponse } from "@/types/availability";
import AvailabilityDayColumn from "./AvailabilityDayColumn";

interface Props {
  availability: DoctorAvailabilityResponse[];
  onAddAvailability?: (day: string) => void;
}

const DAYS: string[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const AvailabilityCalendar = ({ availability, onAddAvailability }: Props) => {
  const grouped: Record<string, DoctorAvailabilityResponse[]> = {};

  DAYS.forEach((d) => (grouped[d] = []));
  availability.forEach((slot) => grouped[slot.dayOfWeek]?.push(slot));

  DAYS.forEach((day) => {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Weekly Availability
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <AvailabilityDayColumn
            key={day}
            day={day}
            slots={grouped[day]}
            onAdd={onAddAvailability}
          />
        ))}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
