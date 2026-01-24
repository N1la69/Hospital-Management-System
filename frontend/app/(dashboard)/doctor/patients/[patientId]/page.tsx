"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateMedicalRecordModal from "@/components/medical-record/CreateMedicalRecordModal";
import { getMedicalHistoryByPatient } from "@/lib/api/medical-record.api";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import { MedicalRecordResponse } from "@/types/medical-record";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DoctorPatientMedicalPage = () => {
  const { patientId } = useParams<{ patientId: string }>();

  const [record, setRecord] = useState<MedicalRecordResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchMedicalRecord = async () => {
    setLoading(true);

    try {
      const res = await getMedicalHistoryByPatient(patientId);

      setRecord(res);
    } catch (error: any) {
      setRecord(null);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          `Error fetching medical record for ${patientId}`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicalRecord();
  }, [patientId]);

  return (
    <DashboardLayout title="Patient Medical Record" menuItems={doctorMenu}>
      {loading && <div className="text-sm text-slate-500">Loading...</div>}

      {!loading && record && record.length === 0 && (
        <div className="bg-white border rounded-xl p-8 text-center space-y-4">
          <p className="text-slate-600">No medical record found.</p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800"
          >
            + Add Medical Record
          </button>
        </div>
      )}

      {!loading && record && record.length > 0 && (
        <div className="bg-white border rounded-xl p-6 space-y-6">
          {record.map((r, idx) => (
            <div key={idx}>
              {/* DIAGNOSIS */}
              <section>
                <h2 className="text-lg font-semibold mb-2">Diagnosis</h2>
                <p>
                  <b>Primary:</b> {r.diagnosis.primaryDiagnosis}
                </p>

                {r.diagnosis.secondaryDiagnosis?.length && (
                  <p>
                    <b>Secondary:</b>{" "}
                    {r.diagnosis.secondaryDiagnosis.join(", ")}
                  </p>
                )}

                <p>
                  <b>Symptoms:</b> {r.diagnosis.symptoms.join(", ")}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {r.diagnosis.clinicalNotes}
                </p>
              </section>

              {/* Vitals */}
              <section>
                <h2 className="text-lg font-semibold mb-2">Vitals</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {r.vitals.height && <div>Height: {r.vitals.height} cm</div>}
                  {r.vitals.weight && <div>Weight: {r.vitals.weight} kg</div>}
                  {r.vitals.bloodPressure && (
                    <div>BP: {r.vitals.bloodPressure}</div>
                  )}
                  {r.vitals.temperature && (
                    <div>Temp: {r.vitals.temperature} °F</div>
                  )}
                  {r.vitals.pulse && <div>Pulse: {r.vitals.pulse}</div>}
                  {r.vitals.oxygenSaturation && (
                    <div>O₂: {r.vitals.oxygenSaturation}%</div>
                  )}
                </div>
              </section>

              {/* Medications */}
              <section>
                <h2 className="text-lg font-semibold mb-2">Medications</h2>

                {r.medications.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No medications prescribed.
                  </p>
                )}

                <div className="space-y-2">
                  {r.medications.map((m, i) => (
                    <div key={i} className="border rounded-md p-3 text-sm">
                      <div className="font-medium">{m.name || "Unnamed"}</div>
                      <div className="text-slate-600">
                        {m.dosage} | {m.frequency} | {m.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Notes */}
              {r.notes && (
                <section>
                  <h2 className="text-lg font-semibold mb-2">
                    Additional Notes
                  </h2>
                  <p className="text-sm text-slate-700">{r.notes}</p>
                </section>
              )}

              {/* Actions */}
              <div className="pt-4 border-t flex justify-end">
                <button
                  className="border px-4 py-2 rounded-md"
                  onClick={() => alert("Edit medical record modal coming next")}
                >
                  Edit Medical Record
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateMedicalRecordModal
        open={showCreateModal}
        patientId={patientId}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          fetchMedicalRecord();
          toast.success("Medical record created successfully.");
        }}
      />
    </DashboardLayout>
  );
};

export default DoctorPatientMedicalPage;
