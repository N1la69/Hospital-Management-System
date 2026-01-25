"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CreateMedicalRecordModal from "@/components/medical-record/CreateMedicalRecordModal";
import UpdateMedicalRecordModal from "@/components/medical-record/UpdateMedicalRecordModal";
import { getMedicalHistoryByPatient } from "@/lib/api/medical-record.api";
import { doctorMenu } from "@/lib/constants/sidebarMenus";
import { MedicalRecordResponse } from "@/types/medical-record";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosDocument } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";
import { toast } from "react-toastify";

function Section({ title, children }: any) {
  return (
    <div className="border rounded-lg p-4 bg-slate-50">
      <h3 className="text-sm font-semibold text-blue-800 mb-2">{title}</h3>
      {children}
    </div>
  );
}

function Vital({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-800">{value}</div>
    </div>
  );
}

const DoctorPatientMedicalPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [patientName, setPatientName] = useState<string | null>(null);
  const [patientCode, setPatientCode] = useState<string | null>(null);

  const [recordId, setRecordId] = useState<string>("");
  const [record, setRecord] = useState<MedicalRecordResponse[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchMedicalRecord = async () => {
    setLoading(true);

    try {
      const res = await getMedicalHistoryByPatient(patientId);

      setRecord(res);

      if (res.length > 0) {
        setRecordId(res[0].id); // ✅ latest record
      } else {
        setRecordId("");
      }
    } catch (error: any) {
      setRecord(null);
      setRecordId("");
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

  useEffect(() => {
    const name = sessionStorage.getItem("currentPatientName");
    const code = sessionStorage.getItem("currentPatientCode");
    setPatientCode(code);
    setPatientName(name);
  }, []);

  return (
    <DashboardLayout title="Patient Medical Record" menuItems={doctorMenu}>
      <div className="mb-6 rounded-xl border bg-linear-to-r from-blue-50 to-indigo-50 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Patient Name:{" "}
            <span className="text-blue-700">{patientName || "Unknown"}</span>
          </h2>
          <div className="mt-1 text-sm text-slate-600 space-x-4">
            <span>
              Patient Code:{" "}
              <b className="text-slate-800">{patientCode || "PAT-"}</b>
            </span>
            <span>
              Record ID: <b className="text-slate-800">{recordId || "N/A"}</b>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-800"
        >
          <IoIosDocument size={18} />
          New Medical Record
        </button>
      </div>

      {loading && (
        <div className="bg-white border rounded-xl p-6 text-sm text-slate-500">
          Loading medical history...
        </div>
      )}

      {!loading && record && record.length === 0 && (
        <div className="bg-white border rounded-xl p-10 text-center space-y-4">
          <p className="text-slate-600">
            No medical records found for this patient.
          </p>

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Create First Record
          </button>
        </div>
      )}

      {!loading && record && record.length > 0 && (
        <div className="space-y-6">
          {record.map((r) => (
            <div
              key={r.id}
              className="relative bg-white border rounded-xl shadow-sm p-6 space-y-6 overflow-hidden"
            >
              <div className="absolute left-0 top-0 h-full w-1 bg-blue-600" />
              {/* Top bar */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Last Updated
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {new Date(r.updatedAt).toLocaleString("en-GB")}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setRecordId(r.id);
                    setShowUpdateModal(true);
                  }}
                  className="rounded-md flex items-center gap-2 border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700 hover:bg-blue-100"
                >
                  <MdEditDocument size={17} />
                  Edit Record
                </button>
              </div>

              {/* Diagnosis */}
              <Section title="Diagnosis">
                <div className="space-y-1 text-sm">
                  <div>
                    <b>Primary:</b> {r.diagnosis.primaryDiagnosis}
                  </div>

                  {r.diagnosis.secondaryDiagnosis &&
                    r.diagnosis.secondaryDiagnosis.length > 0 && (
                      <div>
                        <b>Secondary:</b>{" "}
                        {r.diagnosis.secondaryDiagnosis.join(", ")}
                      </div>
                    )}

                  <div>
                    <b>Symptoms:</b> {r.diagnosis.symptoms.join(", ")}
                  </div>

                  <p className="text-slate-600 mt-2">
                    {r.diagnosis.clinicalNotes}
                  </p>
                </div>
              </Section>

              {/* Vitals */}
              <Section title="Vitals">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
                  {r.vitals.height && (
                    <Vital label="Height" value={`${r.vitals.height} cm`} />
                  )}
                  {r.vitals.weight && (
                    <Vital label="Weight" value={`${r.vitals.weight} kg`} />
                  )}
                  {r.vitals.bloodPressure && (
                    <Vital label="BP" value={r.vitals.bloodPressure} />
                  )}
                  {r.vitals.temperature && (
                    <Vital label="Temp" value={`${r.vitals.temperature} °F`} />
                  )}
                  {r.vitals.pulse && (
                    <Vital label="Pulse" value={String(r.vitals.pulse)} />
                  )}
                  {r.vitals.oxygenSaturation && (
                    <Vital label="O₂" value={`${r.vitals.oxygenSaturation}%`} />
                  )}
                </div>
              </Section>

              {/* Medications */}
              <Section title="Medications">
                {r.medications.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No medications prescribed.
                  </p>
                )}

                {r.medications.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-slate-200 rounded-lg text-sm">
                      <thead className="bg-slate-100 text-slate-700">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">
                            Medicine
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Dosage
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Frequency
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Duration (days)
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {r.medications.map((m, i) => (
                          <tr
                            key={i}
                            className="border-t hover:bg-blue-50/40 transition"
                          >
                            <td className="px-3 py-2 font-medium text-slate-800">
                              {m.name || "Unnamed"}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              {m.dosage || "-"}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              {m.frequency || "-"}
                            </td>
                            <td className="px-3 py-2 text-slate-700">
                              {m.duration || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Section>

              {/* Notes */}
              {r.notes && (
                <Section title="Additional Notes">
                  <p className="text-sm text-slate-700">{r.notes}</p>
                </Section>
              )}
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

      <UpdateMedicalRecordModal
        open={showUpdateModal}
        recordId={recordId}
        patientId={patientId}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={() => {
          setShowUpdateModal(false);
          fetchMedicalRecord();
          toast.success("Medical record updated successfully.");
        }}
      />
    </DashboardLayout>
  );
};

export default DoctorPatientMedicalPage;
