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

  const baseDate = new Date("1970-01-04T00:00:00Z"); // Sunday

  const dayOffset = DAY_INDEX[day];

  // const startIso = new Date(
  //   Date.UTC(
  //     1970,
  //     0,
  //     4 + dayOffset,
  //     Number(startTime.split(":")[0]),
  //     Number(startTime.split(":")[1])
  //   )
  // ).toISOString();

  // const endIso = new Date(
  //   Date.UTC(
  //     1970,
  //     0,
  //     4 + dayOffset,
  //     Number(endTime.split(":")[0]),
  //     Number(endTime.split(":")[1])
  //   )
  // ).toISOString();

  const submit = async () => {
    setError(null);

    console.log("🟡 submit clicked");
    console.log("startTime:", startTime);
    console.log("endTime:", endTime);
    console.log("day:", day);
    console.log("dayOffset:", dayOffset);

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

    console.log("Parsed start:", sh, sm);
    console.log("Parsed end:", eh, em);

    const startUtc = Date.UTC(1970, 0, 4 + dayOffset, sh, sm);
    const endUtc = Date.UTC(1970, 0, 4 + dayOffset, eh, em);

    console.log("startUtc:", startUtc);
    console.log("endUtc:", endUtc);

    const startIso = new Date(startUtc).toISOString();
    const endIso = new Date(endUtc).toISOString();

    console.log("startIso:", startIso);
    console.log("endIso:", endIso);

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
    <Modal open={open} onClose={onClose} title={`Add Availability (${day})`}>
      <div className="space-y-4">
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div>
          <label className="block text-sm mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slot Duration</label>
          <select
            value={slotMinutes}
            onChange={(e) => setSlotMinutes(Number(e.target.value))}
            className="w-full border px-2 py-1 rounded"
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
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Add Availability"}
        </button>
      </div>
    </Modal>
  );
};

export default AddAvailabilityModal;
