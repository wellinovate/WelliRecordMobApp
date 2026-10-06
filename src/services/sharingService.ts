/**
 * WelliRecord Smart Consent & Time-Bound Sharing Service
 * Manages zero-trust medical consent grants, 24h temporary QR codes, and immediate revocation.
 */

export interface ConsentGrant {
  id: string
  providerName: string
  department: string
  grantedAt: string
  expiresAt: string
  scope: string[]
  status: "active" | "revoked" | "expired"
  passcode: string
}

export const sharingService = {
  createTemporaryQrPayload(patientId: string, hours = 24): string {
    const expires = Date.now() + hours * 60 * 60 * 1000
    const token = Math.random().toString(36).substring(2, 10).toUpperCase()
    return JSON.stringify({
      app: "WelliRecord",
      pid: patientId,
      t: token,
      exp: expires,
      v: "1.0",
    })
  },

  formatConsentExpiry(hoursLeft: number): string {
    if (hoursLeft <= 0) return "Expired"
    if (hoursLeft === 1) return "1 hour remaining"
    return `${hoursLeft} hours remaining`
  },
}
