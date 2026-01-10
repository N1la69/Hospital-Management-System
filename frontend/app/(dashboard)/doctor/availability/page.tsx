"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { DoctorAvailabilityResponse } from "@/types/availability";
import { getDoctorAvailability } from "@/lib/api/availability.api";
import AvailabilityCalendar from "@/components/doctor/availability/AvailabilityCalendar";
import AddAvailabilityModal from "@/components/doctor/availability/AddAvailabilityModal";

const DoctorAvailabilityPage = () => {
  const { userId, roles } = useAuth();
  console.log("🔐 AuthContext:", { userId, roles });

  const [availability, setAvailability] = useState<
    DoctorAvailabilityResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState<
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY"
    | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);

  const doctorId = userId; // doctor can only manage self

  const loadAvailability = async () => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const data = await getDoctorAvailability(doctorId);
      setAvailability(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
  }, [doctorId]);

  if (!doctorId) {
    return <div className="p-6">Doctor not identified</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Availability</h1>

      {loading ? (
        <p>Loading availability...</p>
      ) : (
        <AvailabilityCalendar
          availability={availability}
          onAddAvailability={
            roles.includes("ADMIN") || roles.includes("DOCTOR")
              ? (day) => {
                  console.log("📅 Add clicked for day:", day);
                  setSelectedDay(
                    day as
                      | "MONDAY"
                      | "TUESDAY"
                      | "WEDNESDAY"
                      | "THURSDAY"
                      | "FRIDAY"
                      | "SATURDAY"
                      | "SUNDAY"
                  );
                  setModalOpen(true);
                }
              : undefined
          }
        />
      )}

      {selectedDay && (
        <AddAvailabilityModal
          open={modalOpen}
          doctorId={doctorId}
          day={selectedDay}
          onClose={() => setModalOpen(false)}
          onSuccess={loadAvailability}
        />
      )}
    </div>
  );
};

export default DoctorAvailabilityPage;
