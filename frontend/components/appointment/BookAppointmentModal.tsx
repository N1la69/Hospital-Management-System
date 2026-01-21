"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { bookAppointments } from "@/lib/api/appointment.api";
import { fetchPatientOptions } from "@/lib/api/patient.api";
import { fetchDoctorOptions } from "@/lib/api/doctor.api";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Option {
  id: string;
  name: string;
  email?: string;
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600";

function SearchSelect({
  label,
  placeholder,
  query,
  setQuery,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  placeholder: string;
  query: string;
  setQuery: (v: string) => void;
  options: Option[];
  selectedId: string;
  onSelect: (id: string, name: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-slate-600 mb-1">
        {label}
      </label>

      <input
        value={query ?? ""}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={inputClass}
      />

      {open && options.length > 0 && (
        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-white shadow">
          {options.slice(0, 50).map((o) => (
            <div
              key={o.id}
              onClick={() => {
                onSelect(o.id, o.name);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 text-sm hover:bg-slate-100 ${
                selectedId === o.id ? "bg-slate-100 font-medium" : ""
              }`}
            >
              <div>{o.name}</div>
              {o.email && (
                <div className="text-xs text-slate-500">{o.email}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const BookAppointmentModal = ({ open, onClose, onSuccess }: Props) => {
  const [patients, setPatients] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);

  const [patientQuery, setPatientQuery] = useState<string>("");
  const [doctorQuery, setDoctorQuery] = useState<string>("");

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    fetchPatientOptions().then(setPatients).catch(console.error);
    fetchDoctorOptions().then(setDoctors).catch(console.error);
  }, [open]);

  const submit = async () => {
    if (!patientId || !doctorId || !date || !startTime || !endTime) return;

    const startIso = new Date(`${date}T${startTime}:00`).toISOString();
    const endIso = new Date(`${date}T${endTime}:00`).toISOString();

    setLoading(true);

    try {
      await bookAppointments({
        patientId,
        doctorId,
        scheduledStart: startIso,
        scheduledEnd: endIso,
        reason,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to book appointment",
      );
    } finally {
      setLoading(false);
    }
  };

  const safePatientQuery = (patientQuery || "").toLowerCase();
  const safeDoctorQuery = (doctorQuery || "").toLowerCase();

  const filteredPatients = patients.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const email = (p.email || "").toLowerCase();

    return name.includes(safePatientQuery) || email.includes(safePatientQuery);
  });

  const filteredDoctors = doctors.filter((d) => {
    const name = (d.name || "").toLowerCase();
    const email = (d.email || "").toLowerCase();

    return name.includes(safeDoctorQuery) || email.includes(safeDoctorQuery);
  });

  return (
    <Modal open={open} onClose={onClose} title="Book Appointments" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patient Search */}
        <SearchSelect
          label="Patient"
          placeholder="Search patient by name or email"
          query={patientQuery}
          setQuery={setPatientQuery}
          options={filteredPatients}
          selectedId={patientId}
          onSelect={(id, name) => {
            setPatientId(id);
            setPatientQuery(name ?? "");
          }}
        />

        {/* Doctor Search */}
        <SearchSelect
          label="Doctor"
          placeholder="Search doctor by name or email"
          query={doctorQuery}
          setQuery={setDoctorQuery}
          options={filteredDoctors}
          selectedId={doctorId}
          onSelect={(id, name) => {
            setDoctorId(id);
            setDoctorQuery(name ?? "");
          }}
        />

        {/* Date */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Time */}
        <div className="grid grid-cols-2 gap-2">
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
        </div>

        {/* Reason */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for visit"
            className={`${inputClass} min-h-20`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 border-t pt-4">
        <button
          onClick={onClose}
          className="rounded-md border px-4 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </Modal>
  );
};

export default BookAppointmentModal;
