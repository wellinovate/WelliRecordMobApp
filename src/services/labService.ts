import { apiRequest } from "./apiClient"

// Provider-submitted lab result, as stored in the shared `labresults`
// collection and returned by GET /records/labs.
export interface LabResult {
  _id: string
  testName: string
  category?: string
  specimen?: string
  resultValue?: string
  unit?: string
  referenceRange?: { text?: string; min?: number; max?: number }
  interpretation?: string
  collectedAt?: string
  resultedAt?: string
  verificationStatus?: string
  notes?: string
  organizationName?: string | null
  createdAt: string
}

export async function fetchLabs(): Promise<LabResult[]> {
  const res = await apiRequest<{ success: boolean; items: LabResult[] }>(
    "/records/labs"
  )
  return res.items ?? []
}

export function labDate(lab: LabResult): string {
  const raw = lab.resultedAt ?? lab.collectedAt ?? lab.createdAt
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export function labValue(lab: LabResult): string {
  const value = lab.resultValue?.trim()
  if (!value) return "No value recorded"
  return lab.unit ? `${value} ${lab.unit}` : value
}

export function labRange(lab: LabResult): string | null {
  const r = lab.referenceRange
  if (!r) return null
  if (r.text) return r.text
  if (r.min != null && r.max != null) return `${r.min}–${r.max}${lab.unit ? ` ${lab.unit}` : ""}`
  return null
}

export type LabFlag = { label: string; tone: "blue" | "amber" | "red" } | null

// Maps the provider's interpretation field to a badge. Unknown values show
// as-is in neutral blue rather than being guessed at.
export function labFlag(lab: LabResult): LabFlag {
  const raw = lab.interpretation?.trim()
  if (!raw) return null
  const v = raw.toLowerCase()
  if (v === "critical") return { label: "Critical", tone: "red" }
  if (v === "normal") return { label: "Within range", tone: "blue" }
  if (v === "high" || v === "low" || v === "abnormal")
    return { label: `${raw[0].toUpperCase()}${raw.slice(1).toLowerCase()}`, tone: "amber" }
  return { label: raw, tone: "blue" }
}

export function labSource(lab: LabResult): string {
  const s = lab.verificationStatus?.trim().toLowerCase()
  if (s === "verified") return "Verified provider"
  return "Provider submitted"
}
