"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";
import { toast } from "react-toastify";
import { createMedicalRecord } from "@/lib/api/medical-record.api";
import { IoMdAddCircle } from "react-icons/io";

interface Props {
  open: boolean;
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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-blue-900 tracking-wide">
          {title}
        </h3>
      </div>
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

const CreateMedicalRecordModal = ({
  open,
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
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [temperature, setTemperature] = useState<number | "">("");
  const [pulse, setPulse] = useState<number | "">("");
  const [oxygenSaturation, setOxygenSaturation] = useState<number | "">("");

  const [medications, setMedications] = useState([
    { name: "", dosage: "", frequency: "", duration: "" },
  ]);

  const addMedication = () => {
    setMedications((m) => [
      ...m,
      { name: "", dosage: "", frequency: "", duration: "" },
    ]);
  };

  const updateMedication = (index: number, key: string, value: string) => {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [key]: value } : m)),
    );
  };

  const submit = async () => {
    setLoading(true);

    try {
      if (!primaryDiagnosis.trim()) {
        alert("Primary diagnosis is required");
        return;
      }

      if (symptoms.length === 0 || symptoms.every((s) => !s.trim())) {
        alert("Please enter at least one symptom");
        return;
      }

      const payload = {
        patientId,
        manualEntry: true,
        visitDate: new Date().toISOString(),

        diagnosis: {
          primaryDiagnosis: primaryDiagnosis.trim(),
          secondaryDiagnosis: secondaryDiagnosis.filter(Boolean),
          symptoms: symptoms.filter(Boolean),
          clinicalNotes: clinicalNotes.trim(),
        },

        vitals: {
          height: height || 0.0,
          weight: weight || 0,
          bloodPressure: bloodPressure || "120/80",
          temperature: temperature || undefined,
          pulse: pulse || 72,
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

        notes: clinicalNotes.trim() || undefined,
      };

      await createMedicalRecord(payload);

      onSuccess();
      onClose();

      setPrimaryDiagnosis("");
      setSymptoms([]);
      setSecondaryDiagnosis([]);
      setClinicalNotes("");
      setHeight("");
      setWeight("");
      setBloodPressure("120/80");
      setTemperature("");
      setPulse("");
      setOxygenSaturation("");
      setMedications([{ name: "", dosage: "", frequency: "", duration: "" }]);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Error creating medical record",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Medical Record"
      size="lg"
    >
      <div className="space-y-6">
        <div className="text-xs text-slate-500 mb-2">
          Fields marked with <span className="text-red-600">*</span> are
          mandatory
        </div>

        {/* DIAGNOSIS */}
        <Section title="Diagnosis">
          <Grid>
            <Field
              label="Primary Diagnosis"
              required
              hint="Main confirmed diagnosis for this visit"
              className="mb-2"
            >
              <input
                value={primaryDiagnosis}
                onChange={(e) => setPrimaryDiagnosis(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Secondary Diagnosis (comma separated)">
              <input
                value={secondaryDiagnosis}
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
            hint="Enter comma separated symptoms (e.g. fever, headache, nausea)"
            className="mb-2"
          >
            <input
              value={symptoms}
              onChange={(e) =>
                setSymptoms(e.target.value.split(",").map((s) => s.trim()))
              }
              className={inputClass}
            />
          </Field>

          <Field
            label="Clinical Notes"
            required
            hint="Doctor's observations and clinical remarks"
          >
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className={`${inputClass} min-h-20`}
            />
          </Field>
        </Section>

        {/* VITALS */}
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

            <Field label="Pulse">
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

        {/* MEDICATIONS */}
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

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-5 border-t">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="rounded-md bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Medical Record"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateMedicalRecordModal;
