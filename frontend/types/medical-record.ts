export interface DiagnosisDto {
  primaryDiagnosis: string;
  secondaryDiagnosis?: string[];
  symptoms: string[];
  clinicalNotes: string;
}

export interface VitalsDto {
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  pulse?: number;
  oxygenSaturation?: number;
}

export interface MedicationDto {
  name?: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

export interface MedicalRecordResponse {
  id: string;
  patientId: string;
  manualEntry: boolean;
  visitDate: string;
  diagnosis: DiagnosisDto;
  vitals: VitalsDto;
  medications: MedicationDto[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: string;
  manualEntry: boolean;
  visitDate: string;
  diagnosis: DiagnosisDto;
  vitals: VitalsDto;
  medications: MedicationDto[];
  notes?: string;
}
