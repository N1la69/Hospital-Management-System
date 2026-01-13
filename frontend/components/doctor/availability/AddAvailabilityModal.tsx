"use client";

import Modal from "@/components/ui/Modal";
import { createAvailability } from "@/lib/api/availability.api";
import { useState } from "react";

interface Props {
  open: boolean;
  doctorId: string;
  day:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  onClose: () => void;
  onSuccess: () => void;
}

const DAY_INDEX: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

const SLOT_OPTIONS = [15, 30, 60];

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600";

const AddAvailabilityModal = ({
  open,
  doctorId,
  day,
  onClose,
  onSuccess,
}: Props) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotMinutes, setSlotMinutes] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dayOffset = DAY_INDEX[day];

  const submit = async () => {
    setError(null);

    if (!startTime || !endTime) {
      setError("Start time and end time are required");
      return;
    }

    if (startTime >= endTime) {
      setError("Start time must be before end time");
      return;
    }

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);

    const startDate = new Date(1970, 0, 4 + dayOffset, sh, sm);
    const endDate = new Date(1970, 0, 4 + dayOffset, eh, em);

    const startIso = startDate.toISOString();
    const endIso = endDate.toISOString();

    setLoading(true);

    try {
      await createAvailability({
        doctorId,
        dayOfWeek: day,
        startTime: startIso,
        endTime: endIso,
        slotMinutes,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Failed to create availability"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Add Availability (${day})`}
      size="md"
    >
      <div className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Slot Duration
          </label>
          <select
            value={slotMinutes}
            onChange={(e) => setSlotMinutes(Number(e.target.value))}
            className={inputClass}
          >
            {SLOT_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m} minutes
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="w-full rounded-md bg-blue-700 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Add Availability"}
        </button>
      </div>
    </Modal>
  );
};

export default AddAvailabilityModal;
