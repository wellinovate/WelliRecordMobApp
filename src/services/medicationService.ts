import { apiRequest } from "./apiClient"
import { storage } from "../utils/storage"
import { CONFIG } from "./config"

// Provider/pharmacy/patient medication entry from GET /records/medications
// (shared `medications` collection).
export interface MedicationEntry {
  _id: string
  source?: string
  medicationName: string
  genericName?: string
  brandName?: string
  dosage?: { value?: number; unit?: string }
  form?: string
  route?: string
  frequency?: string
  duration?: string
  indication?: string
  prescribedAt?: string | null
  startDate?: string | null
  endDate?: string | null
  medicationStatus?: "active" | "completed" | "stopped" | "on-hold"
  adherence?: string
  scheduleTimes?: string[]
  reminderEnabled?: boolean
  organizationName?: string | null
  createdAt: string
}

export async function fetchMedications(): Promise<MedicationEntry[]> {
  const res = await apiRequest<{ success: boolean; items: MedicationEntry[] }>(
    "/records/medications"
  )
  return res.items ?? []
}

export const isCurrent = (m: MedicationEntry) =>
  (m.medicationStatus ?? "active") === "active" ||
  m.medicationStatus === "on-hold"

export function dosageText(m: MedicationEntry): string | null {
  const d = m.dosage
  if (d?.value == null) return null
  return d.unit ? `${d.value} ${d.unit}` : String(d.value)
}

// "08:00" -> "8:00 AM"
export function clockLabel(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm
  const suffix = h >= 12 ? "PM" : "AM"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
}

// Next scheduled dose time today across current medications, if any.
export function nextDose(
  meds: MedicationEntry[],
  now = new Date()
): { med: MedicationEntry; time: string } | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  let best: { med: MedicationEntry; time: string; minutes: number } | null = null
  for (const med of meds.filter(isCurrent)) {
    for (const time of med.scheduleTimes ?? []) {
      const [h, m] = time.split(":").map(Number)
      const minutes = h * 60 + m
      if (minutes >= nowMinutes && (!best || minutes < best.minutes)) {
        best = { med, time, minutes }
      }
    }
  }
  return best && { med: best.med, time: best.time }
}

// --- Self-reported "taken today" log --------------------------------------
// Stored on the device only, as { [medicationId]: "YYYY-MM-DD" }. It is a
// personal checklist, not part of the clinical record.

const todayKey = () => new Date().toISOString().slice(0, 10)

async function readLog(): Promise<Record<string, string>> {
  const raw = await storage.getItem(CONFIG.medicationsKey)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

export async function takenToday(): Promise<Set<string>> {
  const today = todayKey()
  const log = await readLog()
  return new Set(Object.keys(log).filter((id) => log[id] === today))
}

export async function toggleTakenToday(id: string): Promise<Set<string>> {
  const today = todayKey()
  const log = await readLog()
  // Drop entries from earlier days so the stored value stays small.
  const next: Record<string, string> = {}
  for (const key of Object.keys(log)) if (log[key] === today) next[key] = today
  if (next[id]) delete next[id]
  else next[id] = today
  await storage.setItem(CONFIG.medicationsKey, JSON.stringify(next))
  return new Set(Object.keys(next))
}
