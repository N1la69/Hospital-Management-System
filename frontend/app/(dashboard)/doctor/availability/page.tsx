"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { DoctorAvailabilityResponse } from "@/types/availability";
import { getDoctorAvailability } from "@/lib/api/availability.api";
import AvailabilityCalendar from "@/components/doctor/availability/AvailabilityCalendar";
import AddAvailabilityModal from "@/components/doctor/availability/AddAvailabilityModal";
import { getMyDoctorProfile } from "@/lib/api/doctor.api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import { toast } from "react-toastify";

const DoctorAvailabilityPage = () => {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const { userId, roles } = useAuth();

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

  useEffect(() => {
    if (!userId) return;

    getMyDoctorProfile().then((doc) => {
      setDoctorId(doc.id);
    });
  }, [userId]);

  const loadAvailability = async () => {
    if (!doctorId) return;

    setLoading(true);
    try {
      const data = await getDoctorAvailability(doctorId);
      setAvailability(data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to get availabilities",
      );
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
    <DashboardLayout title="My Schedule" menuItems={doctorMenu}>
      {loading ? (
        <p className="text-sm text-slate-500">Loading availability...</p>
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
                      | "SUNDAY",
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
    </DashboardLayout>
  );
};

export default DoctorAvailabilityPage;
