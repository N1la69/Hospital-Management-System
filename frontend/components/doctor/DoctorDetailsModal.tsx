"use client";

import { DoctorDetailsResponse } from "@/types/doctor";
import Modal from "../ui/Modal";
import dayjs from "dayjs";
import InfoItem from "../ui/InfoItem";

interface Props {
  open: boolean;
  data: DoctorDetailsResponse | null;
  onClose: () => void;
}

const DoctorDetailsModal = ({ open, data, onClose }: Props) => {
  if (!data) return null;

  const { doctor, availability } = data;

  return (
    <Modal open={open} onClose={onClose} title="Doctor Details" size="lg">
      <div className="space-y-6">
        {/* Doctor Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {doctor.fullName}
            </h2>
            <p className="text-sm text-slate-500">
              Doctor Code: {doctor.doctorCode}
            </p>
          </div>

          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {doctor.specialization}
          </span>
        </div>

        {/* Doctor Info */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Doctor Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <InfoItem
              label="Experience"
              value={`${doctor.experienceYears} years`}
            />
            <InfoItem
              label="Consultation Fees"
              value={`₹${doctor.consultationFees}`}
            />
            <InfoItem label="Email" value={doctor.email} />
            <InfoItem label="Phone" value={doctor.phone} />
            <InfoItem label="Address" value={doctor.address} full />
          </div>
        </section>

        {/* Availability */}
        <section className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-blue-900 mb-4 tracking-wide">
            Weekly Availability
          </h3>

          {availability.length === 0 && (
            <div className="text-sm text-slate-500 bg-slate-50 rounded-md p-4 text-center">
              No availability configured.
            </div>
          )}

          {availability.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Day</th>
                    <th className="px-3 py-2 text-left">Start</th>
                    <th className="px-3 py-2 text-left">End</th>
                    <th className="px-3 py-2 text-left">Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {availability.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t hover:bg-slate-50 transition"
                    >
                      <td className="px-3 py-2 font-medium text-slate-700">
                        {a.dayOfWeek}
                      </td>
                      <td className="px-3 py-2">
                        {dayjs(a.startTime).format("HH:mm")}
                      </td>
                      <td className="px-3 py-2">
                        {dayjs(a.endTime).format("HH:mm")}
                      </td>
                      <td className="px-3 py-2">
                        <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                          {a.slotMinutes} min
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </Modal>
  );
};

export default DoctorDetailsModal;
