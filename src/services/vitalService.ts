import { apiRequest } from "./apiClient"

// Provider- or patient-entered vitals, as stored in the shared `vitals`
// collection and returned by GET /records/vitals.
export interface VitalEntry {
  _id: string
  source?: string
  bloodPressure?: { systolic?: number; diastolic?: number }
  heartRate?: number
  temperature?: { value?: number; unit?: string }
  respiratoryRate?: number
  oxygenSaturation?: number
  weight?: { value?: number; unit?: string }
  height?: { value?: number; unit?: string }
  bmi?: number
  bloodGlucose?: { value?: number; unit?: string; fasting?: boolean }
  measuredAt?: string
  organizationName?: string | null
  createdAt: string
}

export async function fetchVitals(): Promise<VitalEntry[]> {
  const res = await apiRequest<{ success: boolean; items: VitalEntry[] }>(
    "/records/vitals"
  )
  return res.items ?? []
}

export interface VitalReading {
  label: string
  value: string
}

const has = (n: unknown): n is number => typeof n === "number" && !Number.isNaN(n)

// Only measurements that were actually recorded appear; nothing is inferred.
export function vitalReadings(v: VitalEntry): VitalReading[] {
  const out: VitalReading[] = []
  const bp = v.bloodPressure
  if (has(bp?.systolic) && has(bp?.diastolic))
    out.push({ label: "Blood pressure", value: `${bp.systolic}/${bp.diastolic} mmHg` })
  if (has(v.heartRate)) out.push({ label: "Heart rate", value: `${v.heartRate} bpm` })
  if (has(v.temperature?.value))
    out.push({ label: "Temperature", value: `${v.temperature!.value} °${v.temperature!.unit ?? "C"}` })
  if (has(v.respiratoryRate))
    out.push({ label: "Respiratory rate", value: `${v.respiratoryRate} /min` })
  if (has(v.oxygenSaturation))
    out.push({ label: "Oxygen saturation", value: `${v.oxygenSaturation}%` })
  if (has(v.weight?.value))
    out.push({ label: "Weight", value: `${v.weight!.value} ${v.weight!.unit ?? "kg"}` })
  if (has(v.height?.value))
    out.push({ label: "Height", value: `${v.height!.value} ${v.height!.unit ?? "cm"}` })
  if (has(v.bmi)) out.push({ label: "BMI", value: `${v.bmi}` })
  if (has(v.bloodGlucose?.value))
    out.push({
      label: v.bloodGlucose!.fasting ? "Blood glucose (fasting)" : "Blood glucose",
      value: `${v.bloodGlucose!.value} ${v.bloodGlucose!.unit ?? "mg/dL"}`,
    })
  return out
}

export function vitalDate(v: VitalEntry): Date {
  return new Date(v.measuredAt ?? v.createdAt)
}

export function vitalSourceLabel(v: VitalEntry): string {
  switch (v.source) {
    case "provider":
      return "Verified provider"
    case "device":
      return "Device"
    case "imported":
      return "Imported"
    default:
      return "Patient Added"
  }
}
