import { apiRequest } from "./apiClient"

export interface Appointment {
  id: string
  source: "request" | "web"
  facilityName: string
  facilityAddress: string
  scheduledFor: string
  timeSlot: string
  reason: string
  status: string
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const res = await apiRequest<{ success: boolean; appointments: Appointment[] }>(
    "/appointments"
  )
  return res.appointments ?? []
}

const ACTIVE = new Set(["requested", "confirmed", "checked_in"])

// Earliest appointment that is still ahead (or today) and not cancelled.
export function nextAppointment(
  list: Appointment[],
  now = new Date()
): Appointment | null {
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)
  const upcoming = list
    .filter(
      (a) =>
        ACTIVE.has(a.status) &&
        new Date(a.scheduledFor).getTime() >= startOfToday.getTime()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    )
  return upcoming[0] ?? null
}

export interface BookingInput {
  facilityId?: string
  facilityName: string
  facilityAddress?: string
  // ISO timestamp of the chosen day (the server only uses the date part).
  date: string
  // Preferred window, e.g. "Morning (8 AM–12 PM)". The facility confirms
  // the exact time.
  timeSlot: string
  reason?: string
}

export async function createAppointmentRequest(
  input: BookingInput
): Promise<Appointment> {
  const res = await apiRequest<{ success: boolean; appointment: Appointment }>(
    "/appointments/requests",
    { method: "POST", body: input }
  )
  return res.appointment
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const res = await apiRequest<{ success: boolean; appointment: Appointment }>(
    `/appointments/${encodeURIComponent(id)}/cancel`,
    { method: "POST" }
  )
  return res.appointment
}

export function statusLabel(status: string): {
  label: string
  tone: "blue" | "amber" | "red"
} {
  switch (status) {
    case "requested":
      return { label: "Awaiting confirmation", tone: "amber" }
    case "confirmed":
      return { label: "Confirmed", tone: "blue" }
    case "checked_in":
      return { label: "Checked in", tone: "blue" }
    case "completed":
      return { label: "Completed", tone: "blue" }
    case "cancelled":
      return { label: "Cancelled", tone: "red" }
    case "no_show":
      return { label: "Missed", tone: "red" }
    default:
      return { label: status, tone: "blue" }
  }
}

export function formatAppointmentDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
