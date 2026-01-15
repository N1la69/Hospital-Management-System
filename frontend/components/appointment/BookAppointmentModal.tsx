"use client";

import api from "@/lib/utils/axios";
import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { bookAppointments } from "@/lib/api/appointment.api";
import { fetchPatientOptions, fetchPatients } from "@/lib/api/patient.api";
import { PatientResponse } from "@/types/patient";
import { fetchDoctorOptions } from "@/lib/api/doctor.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Option {
  id: string;
  name: string;
}

const BookAppointmentModal = ({ open, onClose, onSuccess }: Props) => {
  const [patients, setPatients] = useState<Option[]>([]);
  const [doctors, setDoctors] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

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
      console.log(
        "PatientId:" + patientId,
        "DoctorId:" + doctorId,
        "StartTime:" + startIso,
        "EndTime:" + endIso,
        "Reason:" + reason
      );

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
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to book appointment";
      alert(message);
      console.log(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Book Appointments">
      <div className="space-y-4">
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </Modal>
  );
};

export default BookAppointmentModal;
