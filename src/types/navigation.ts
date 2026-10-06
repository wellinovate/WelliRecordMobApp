export type Screen =
  | "home"
  | "records"
  | "timeline"
  | "medications"
  | "profile"
  | "reports"
  | "result"
  | "revoke"
  | "shared"
  | "lostPhone"
  | "recovered"
  | "verifyRecovery"
  | "recoverAccount"
  | "emptyVault"
  | "preferences"
  | "createAccount"
  | "welcome"
  | "bookingReview"
  | "bookingTime"
  | "offline"
  | "uploadFailed"
  | "labsLoading"
  | "onboardingRecord"
  | "onboardingId"
  | "verifyPhone"
  | "checkedIn"
  | "checkIn"
  | "bookingConfirmed"
  | "recordChat"
  | "careDiscovery"
  | "visitPrep"
  | "careJourney"
  | "uploadReview"
  | "consentExpanded"
  | "recordActivity"
  | "emergencyQr"
  | "emergencyInfo"
  | "healthPassport"
  | "recordAdded"
  | "signIn"

export type CareStage = "scheduled" | "booked" | "checkedIn"

export type PendingConsent = "pending" | "approved" | "rejected"

export type TabId = "home" | "records" | "careDiscovery" | "consentExpanded" | "profile"

export const screenTitles: Record<Screen, string> = {
  home: "Good morning, Adaeze",
  records: "My health records",
  timeline: "Health timeline",
  medications: "My medicines",
  profile: "My profile",
  reports: "Laboratory reports",
  result: "Understand this result",
  revoke: "Review consent",
  shared: "Consent confirmed",
  lostPhone: "Security",
  recovered: "Account recovery",
  verifyRecovery: "Account recovery",
  recoverAccount: "Account recovery",
  emptyVault: "My health records",
  preferences: "Preferences",
  createAccount: "Create account",
  welcome: "Welcome to WelliRecord",
  bookingReview: "Book an appointment",
  bookingTime: "Book an appointment",
  offline: "Saved offline",
  uploadFailed: "Document upload",
  labsLoading: "Laboratory reports",
  onboardingRecord: "Set up WelliRecord",
  onboardingId: "Set up WelliRecord",
  verifyPhone: "Verify your contact",
  checkedIn: "Visit check-in",
  checkIn: "Visit check-in",
  bookingConfirmed: "Appointment",
  recordChat: "Ask about my records",
  careDiscovery: "Care, closer to you",
  visitPrep: "Prepare for your visit",
  careJourney: "Your care journey",
  uploadReview: "Review your upload",
  consentExpanded: "Consent Center",
  recordActivity: "Your record activity",
  emergencyQr: "Your emergency QR",
  emergencyInfo: "Emergency information",
  healthPassport: "Your Health Passport",
  recordAdded: "Record added",
  signIn: "Sign in",
}
