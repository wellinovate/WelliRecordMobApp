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
