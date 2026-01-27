"use client";

import { bloodGroupMapper, PatientDetailsResponse } from "@/types/patient";
import Modal from "../ui/Modal";

interface Props {
  open: boolean;
  data: PatientDetailsResponse | null;
  onClose: () => void;
}

const InfoItem = ({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) => (
  <div className={full ? "sm:col-span-2" : ""}>
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="text-sm font-medium text-slate-800 wrap-break-word">
      {value}
    </p>
  </div>
);

const PatientDetailsModal = ({ open, data, onClose }: Props) => {
  if (!data) return null;

  const { patient, lastAppointment } = data;

  return (
    <Modal open={open} onClose={onClose} title="Patient Details" size="lg">
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {patient.fullName}
            </h2>
            <p className="text-sm text-slate-500">
              Patient Code: {patient.patientCode}
            </p>
          </div>
        </div>

        {/* Patient Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Patient Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem
              label="Blood Group"
              value={
                bloodGroupMapper[
                  patient.bloodGroup as keyof typeof bloodGroupMapper
                ] || patient.bloodGroup
              }
            />
            <InfoItem label="Gender" value={patient.gender} />
            <InfoItem
              label="Date of Birth"
              value={new Date(patient.dateOfBirth).toLocaleDateString("en-GB")}
            />
            <InfoItem label="Email" value={patient.email} />
            <InfoItem label="Phone" value={patient.phone} />
            <InfoItem label="Address" value={patient.address} full />
          </div>
        </section>

        {/* Appointment Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Last Appointment
          </h3>

          {!lastAppointment ? (
            <div className="text-sm text-slate-500 italic">
              This patient has no previous appointments.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <InfoItem
                label="Appointment Code"
                value={lastAppointment.appointmentCode}
              />

              <InfoItem label="Doctor" value={lastAppointment.doctorName} />

              <InfoItem
                label="Date"
                value={new Date(
                  lastAppointment.scheduledStart,
                ).toLocaleDateString("en-GB")}
              />

              <InfoItem
                label="Time"
                value={new Date(
                  lastAppointment.scheduledStart,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              />
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default PatientDetailsModal;
