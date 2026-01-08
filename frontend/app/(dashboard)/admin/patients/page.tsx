"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchPatients } from "@/lib/api/patient.api";
import { PatientResponse } from "@/types/patient";
import { useEffect, useState } from "react";

const AdminPatientsPage = () => {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="Patients">
      {loading && <p>Loading patients...</p>}

      {!loading && patients.length === 0 && <p>No patients found.</p>}

      {!loading && patients.length > 0 && (
        <table className="w-full bg-white border">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Name</th>
              <th className="p-2">Blood Group</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr className="border-b" key={patient.id}>
                <td className="p-2">{patient.patientCode}</td>
                <td className="p-2">{patient.fullName}</td>
                <td className="p-2">{patient.bloodGroup}</td>
                <td className="p-2">{patient.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

export default AdminPatientsPage;
