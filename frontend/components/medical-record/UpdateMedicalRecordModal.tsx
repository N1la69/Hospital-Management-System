"use client";

import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { toast } from "react-toastify";
import {
  getMedicalHistoryByPatient,
  updateMedicalRecord,
} from "@/lib/api/medical-record.api";
import { MedicalRecordResponse } from "@/types/medical-record";
import Field from "../ui/Field";

interface Props {
  open: boolean;
  recordId: string;
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  );
}

const inputClass =
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600";

const UpdateMedicalRecordModal = ({
  open,
  recordId,
  patientId,
  onClose,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState("");

  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [temperature, setTemperature] = useState<number | "">("");
  const [pulse, setPulse] = useState<number | "">("");
  const [oxygenSaturation, setOxygenSaturation] = useState<number | "">("");

  const [medications, setMedications] = useState<
    { name: string; dosage: string; frequency: string; duration: string }[]
  >([]);

  const updateMedication = (i: number, k: string, v: string) => {
    setMedications((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [k]: v } : m)),
    );
  };

  const addMedication = () => {
    setMedications((m) => [
      ...m,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);

        const records = await getMedicalHistoryByPatient(patientId);
        const rec = records.find((r) => r.id === recordId);
        if (!rec) toast.error("Record not found");

        hydrate(rec as MedicalRecordResponse);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load medical record",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, recordId]);

  const hydrate = (r: MedicalRecordResponse) => {
    setPrimaryDiagnosis(r.diagnosis.primaryDiagnosis);
    setSecondaryDiagnosis(r.diagnosis.secondaryDiagnosis || []);
    setSymptoms(r.diagnosis.symptoms);
    setClinicalNotes(r.diagnosis.clinicalNotes);

    setHeight(r.vitals.height || "");
    setWeight(r.vitals.weight || "");
    setBloodPressure(r.vitals.bloodPressure || "");
    setTemperature(r.vitals.temperature || "");
    setPulse(r.vitals.pulse || "");
    setOxygenSaturation(r.vitals.oxygenSaturation || "");

    setMedications(
      r.medications.map((m) => ({
        name: m.name || "",
        dosage: m.dosage || "",
        frequency: m.frequency || "",
        duration: m.duration || "",
      })),
    );
  };

  const submit = async () => {
    setLoading(true);

    try {
      const payload = {
        recordId,

        diagnosis: {
          primaryDiagnosis,
          secondaryDiagnosis: secondaryDiagnosis.filter(Boolean),
          symptoms: symptoms.filter(Boolean),
          clinicalNotes,
        },

        vitals: {
          height: height || undefined,
          weight: weight || undefined,
          bloodPressure: bloodPressure || undefined,
          temperature: temperature || undefined,
          pulse: pulse || undefined,
          oxygenSaturation: oxygenSaturation || undefined,
        },

        medications: medications
          .filter((m) => m.name || m.dosage || m.frequency || m.duration)
          .map((m) => ({
            name: m.name || undefined,
            dosage: m.dosage || undefined,
            frequency: m.frequency || undefined,
            duration: m.duration || undefined,
          })),

        notes: clinicalNotes || "",
      };

      await updateMedicalRecord(payload);

      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update medical record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update Medical Record"
      size="lg"
    >
      <div className="space-y-6">
        <Section title="Diagnosis">
          <Grid>
            <Field label="Primary Diagnosis">
              <input
                value={primaryDiagnosis}
                onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Secondary Diagnosis">
              <input
                value={secondaryDiagnosis.join(", ")}
                onChange={(e) =>
                  setSecondaryDiagnosis(
                    e.target.value.split(",").map((s) => s.trim()),
                  )
                }
                className={inputClass}
              />
            </Field>
          </Grid>

          <Field label="Symptoms">
            <input
              value={symptoms.join(", ")}
              onChange={(e) =>
                setSymptoms(e.target.value.split(",").map((s) => s.trim()))
              }
              className={inputClass}
            />
          </Field>

          <Field label="Clinical Notes">
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className={`${inputClass} min-h-20`}
            />
          </Field>
        </Section>

        <Section title="Vitals">
          <Grid>
            <Field label="Height">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Weight">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="BP">
              <input
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Temperature">
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="Pulse">
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
            <Field label="O₂">
              <input
                type="number"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(Number(e.target.value))}
                className={inputClass}
              />
            </Field>
          </Grid>
        </Section>

        <Section title="Medications">
          {medications.map((m, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              <input
                value={m.name}
                onChange={(e) => updateMedication(i, "name", e.target.value)}
                className={inputClass}
              />
              <input
                value={m.dosage}
                onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                className={inputClass}
              />
              <input
                value={m.frequency}
                onChange={(e) =>
                  updateMedication(i, "frequency", e.target.value)
                }
                className={inputClass}
              />
              <input
                value={m.duration}
                onChange={(e) =>
                  updateMedication(i, "duration", e.target.value)
                }
                className={inputClass}
              />
            </div>
          ))}

          <button onClick={addMedication} className="text-sm text-blue-700">
            + Add medication
          </button>
        </Section>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button onClick={onClose} className="border px-4 py-2 rounded-md">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submit}
            className="bg-blue-700 text-white px-5 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Record"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMedicalRecordModal;
