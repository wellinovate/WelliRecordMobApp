import { apiRequest } from "./apiClient"

export type GrantStatus =
  | "pending"
  | "active"
  | "expired"
  | "revoked"
  | "rejected"

export interface Grant {
  id: string
  status: GrantStatus
  granteeType: string
  granteeName: string
  accessScope: "full-record" | "category"
  category: string | null
  recordFrom: string | null
  recordTo: string | null
  startsAt: string | null
  expiresAt: string | null
  permissions: string[]
  purpose: string | null
  requestedByProvider: boolean
  rejectionReason: string | null
  createdAt: string
  reviewedAt: string | null
  revokedAt: string | null
}

export interface ShareInput {
  granteeOrganizationId: string
  accessScope: "full-record" | "category"
  category?: string
  durationDays: number
  purpose?: string
  // One-time code from requestShareCode(); the server rejects a share without it.
  code: string
}

type GrantResponse = { success: boolean; grant: Grant }

export const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "lab-results", label: "Lab results" },
  { value: "medications", label: "Medications" },
  { value: "vitals", label: "Vitals" },
  { value: "allergies", label: "Allergies" },
  { value: "diagnoses", label: "Diagnoses" },
  { value: "immunizations", label: "Immunizations" },
  { value: "radiology", label: "Radiology" },
  { value: "procedures", label: "Procedures" },
  { value: "vision", label: "Vision" },
]

export const DURATION_OPTIONS: { days: number; label: string }[] = [
  { days: 1, label: "24 hours" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
]

export async function fetchGrants(): Promise<Grant[]> {
  const res = await apiRequest<{ success: boolean; grants: Grant[] }>(
    "/access/grants"
  )
  return res.grants ?? []
}

export interface ShareCodeResult {
  channel: "email" | "sms"
  sentTo: string
}

// Sends the patient a confirmation code (email if on file, otherwise SMS).
export async function requestShareCode(): Promise<ShareCodeResult> {
  const res = await apiRequest<{
    success: boolean
    channel: "email" | "sms"
    sentTo: string
  }>("/access/grants/code", { method: "POST", body: {} })
  return { channel: res.channel, sentTo: res.sentTo }
}

export async function createGrant(input: ShareInput): Promise<Grant> {
  const res = await apiRequest<GrantResponse>("/access/grants", {
    method: "POST",
    body: input,
  })
  return res.grant
}

export async function approveGrant(
  id: string,
  durationDays?: number
): Promise<Grant> {
  const res = await apiRequest<GrantResponse>(`/access/grants/${id}/approve`, {
    method: "POST",
    body: durationDays ? { durationDays } : {},
  })
  return res.grant
}

export async function rejectGrant(id: string, reason?: string): Promise<Grant> {
  const res = await apiRequest<GrantResponse>(`/access/grants/${id}/reject`, {
    method: "POST",
    body: reason ? { reason } : {},
  })
  return res.grant
}

export async function revokeGrant(id: string): Promise<Grant> {
  const res = await apiRequest<GrantResponse>(`/access/grants/${id}/revoke`, {
    method: "POST",
    body: {},
  })
  return res.grant
}

export function categoryLabel(value: string | null): string {
  return CATEGORY_OPTIONS.find((c) => c.value === value)?.label ?? value ?? ""
}

export function scopeLabel(g: Grant): string {
  return g.accessScope === "full-record"
    ? "Full record, view only"
    : `${categoryLabel(g.category)} only, view only`
}

export function grantDateTime(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

// The server marks a grant expired only when asked again; compute it here so
// a list that has been open past the expiry time stays correct.
export function liveStatus(g: Grant, now = Date.now()): GrantStatus {
  if (g.status === "active" && g.expiresAt && new Date(g.expiresAt).getTime() <= now) {
    return "expired"
  }
  return g.status
}
