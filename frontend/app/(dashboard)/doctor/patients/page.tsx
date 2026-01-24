"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateMedicalRecordModal from "@/components/medical-record/CreateMedicalRecordModal";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import { useState } from "react";

const DoctorPatientsPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout title="My Patients" menuItems={doctorMenu}>
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Patient Details
        </h2>
      </div>

      <div>
        <button onClick={() => setOpen(true)}>Add Medical Record</button>
      </div>

      <CreateMedicalRecordModal
        open={open}
        patientId=""
        onClose={() => setOpen(false)}
        onSuccess={() => {
          setOpen(false);
        }}
      />
    </DashboardLayout>
  );
};

export default DoctorPatientsPage;
