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
import { IoMdAddCircle } from "react-icons/io";

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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-blue-900 tracking-wide">
        {title}
      </h3>
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
  "w-full rounded-md border border-slate-300 px-3 py-2 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 " +
  "placeholder:text-slate-400 bg-white";

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
        <div className="text-xs text-slate-500">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory
        </div>

        <Section title="Diagnosis">
          <Grid>
            <Field
              label="Primary Diagnosis"
              required
              hint="Main confirmed diagnosis for this visit"
              className="mb-3"
            >
              <input
                value={primaryDiagnosis}
                onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="Secondary Diagnosis"
              hint="Comma separated if multiple"
            >
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

          <Field
            label="Symptoms"
            required
            hint="Comma separated (e.g. fever, cough, headache)"
            className="mb-3"
          >
            <input
              value={symptoms.join(", ")}
              onChange={(e) =>
                setSymptoms(e.target.value.split(",").map((s) => s.trim()))
              }
              className={inputClass}
            />
          </Field>

          <Field
            label="Clinical Notes"
            required
            hint="Doctor's clinical observations"
          >
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className={`${inputClass} min-h-24`}
            />
          </Field>
        </Section>

        <Section title="Vitals">
          <Grid>
            <Field label="Height (cm)">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Weight (kg)">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Blood Pressure">
              <input
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Temperature (°F)">
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Pulse (bpm)">
              <input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className={inputClass}
              />
            </Field>

            <Field label="Oxygen Saturation (%)">
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
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 p-3 border rounded-lg bg-slate-50"
            >
              <input
                placeholder="Medicine name"
                value={m.name}
                onChange={(e) => updateMedication(i, "name", e.target.value)}
                className={inputClass}
              />

              <input
                placeholder="Dosage (e.g. 500mg)"
                value={m.dosage}
                onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                className={inputClass}
              />

              <input
                placeholder="Frequency (e.g. 2x daily)"
                value={m.frequency}
                onChange={(e) =>
                  updateMedication(i, "frequency", e.target.value)
                }
                className={inputClass}
              />

              <input
                placeholder="Duration (e.g. 5 days)"
                value={m.duration}
                onChange={(e) =>
                  updateMedication(i, "duration", e.target.value)
                }
                className={inputClass}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addMedication}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-600"
          >
            <span>
              <IoMdAddCircle size={17} />
            </span>{" "}
            Add another medication
          </button>
        </Section>

        <div className="flex justify-end gap-3 pt-5 border-t">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={submit}
            className="rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Medical Record"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMedicalRecordModal;
