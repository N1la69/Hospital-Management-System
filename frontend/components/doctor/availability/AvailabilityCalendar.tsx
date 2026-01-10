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
  console.log("🗓️ Calendar props:", {
    hasOnAdd: !!onAddAvailability,
    availabilityCount: availability.length,
  });

  const grouped: Record<string, DoctorAvailabilityResponse[]> = DAYS.reduce(
    (acc, day) => {
      acc[day] = [];
      return acc;
    },
    {} as Record<string, DoctorAvailabilityResponse[]>
  );

  availability.forEach((slot) => {
    grouped[slot.dayOfWeek]?.push(slot);
  });

  // Sort slots per day by start time
  DAYS.forEach((day) => {
    grouped[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {DAYS.map((day) => (
        <AvailabilityDayColumn
          key={day}
          day={day}
          slots={grouped[day]}
          onAdd={onAddAvailability}
        />
      ))}
    </div>
  );
};

export default AvailabilityCalendar;
