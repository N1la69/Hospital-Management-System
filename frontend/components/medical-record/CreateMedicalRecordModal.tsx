"use client";

import { useState } from "react";
import Modal from "../ui/Modal";
import Field from "../ui/Field";

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

const CreateMedicalRecordModal = ({
  open,
  patientId,
  onClose,
  onSuccess,
}: Props) => {
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

  const submit = async () => {};

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Medical Record"
      size="lg"
    >
      <div className="space-y-6">
        {/* DIAGNOSIS */}
        <Section title="Diagnosis">
          <Grid>
            <Field label="Primary Diagnosis">
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

          <Field label="Symptoms (comma separated)">
            <input
              value={symptoms}
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
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
              <input
                placeholder="Name"
                value={m.name}
                onChange={(e) => updateMedication(i, "name", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Dosage"
                value={m.dosage}
                onChange={(e) => updateMedication(i, "dosage", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Frequency"
                value={m.frequency}
                onChange={(e) =>
                  updateMedication(i, "frequency", e.target.value)
                }
                className={inputClass}
              />
              <input
                placeholder="Duration"
                value={m.duration}
                onChange={(e) =>
                  updateMedication(i, "duration", e.target.value)
                }
                className={inputClass}
              />
            </div>
          ))}

          <button
            onClick={addMedication}
            className="text-sm text-blue-700 hover:underline"
          >
            + Add medication
          </button>
        </Section>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="rounded-md bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Save Medical Record
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateMedicalRecordModal;
