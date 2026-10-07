import { apiRequest } from "./apiClient"

export type AuthMode = "login" | "signup"

export interface SessionUser {
  id: string
  fullName: string | null
  wrId: string | null
  memberId: string | null
  phoneNumber: string | null
  email: string | null
  dateOfBirth: string | null
  bloodType: string | null
  genotype: string | null
}

export interface AuthSession {
  token: string
  user: SessionUser
}

export type Contact = { phone: string } | { email: string }

// Sends a one-time code by SMS (phone) or email.
export function sendOtp(contact: Contact, mode: AuthMode, fullName?: string) {
  if ("phone" in contact) {
    return apiRequest<{ success: boolean; message: string }>(
      "/auth/otp/send",
      { method: "POST", auth: false, body: { phoneNumber: contact.phone, mode } }
    )
  }
  return apiRequest<{ success: boolean; message: string }>("/auth/email/send", {
    method: "POST",
    auth: false,
    body: { email: contact.email, mode, fullName },
  })
}

// Verifies the code. In signup mode the server creates the account and
// profile; in login mode it returns 404 if no account exists.
export function verifyOtp(
  contact: Contact,
  code: string,
  mode: AuthMode,
  fullName?: string
) {
  return apiRequest<AuthSession>("/auth/otp/verify", {
    method: "POST",
    auth: false,
    body: {
      ...("phone" in contact
        ? { phoneNumber: contact.phone }
        : { email: contact.email }),
      code,
      mode,
      fullName,
    },
  })
}

export async function fetchProfile() {
  const res = await apiRequest<{ success: boolean; profile: any | null }>(
    "/profile/me"
  )
  return res.profile
}

// One input accepts either contact type on the sign-in screen.
export function contactFromInput(value: string): Contact {
  const trimmed = value.trim()
  return trimmed.includes("@") ? { email: trimmed.toLowerCase() } : { phone: trimmed }
}
