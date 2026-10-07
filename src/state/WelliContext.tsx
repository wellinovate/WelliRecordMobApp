import React, { createContext, useContext, useEffect, useState } from "react"
import { router } from "expo-router"
import { CareStage, PendingConsent } from "../types/navigation"
import { hapticFeedback } from "../utils/haptics"
import { storage } from "../utils/storage"
import { offlineSyncService, EmergencyOfflineProfile } from "../services/offlineSyncService"
import { TOKEN_KEY, setUnauthorizedHandler } from "../services/apiClient"
import { clearRecordsCache } from "../hooks/useRecords"
import { fetchProfile, type AuthSession, type SessionUser } from "../services/authService"

const SETUP_COMPLETE_KEY = "wellirecord-setup-complete"

interface WelliContextType {
  // Auth/onboarding gate. isAuthReady flips true once the stored flag has
  // been read (SecureStore/localStorage is async) — the root route waits
  // for this before deciding whether to show the auth stack or the tabs.
  isAuthReady: boolean
  isAuthenticated: boolean
  user: SessionUser | null
  setupFlow: boolean
  recordAdded: boolean
  careStage: CareStage
  activeConsent: boolean
  pendingConsent: PendingConsent
  emergencyActive: boolean
  isOffline: boolean
  emergencyProfile: EmergencyOfflineProfile | null
  toggleOfflineMode: () => void
  addRecord: () => void
  startAccountCreation: () => void
  completeOnboarding: (target?: "home" | "records") => void
  // Stores the token returned by OTP verification. Does not navigate: the
  // caller decides whether this is a login (signIn) or onboarding continues.
  establishSession: (session: AuthSession) => Promise<void>
  signIn: () => void
  signOut: () => void
  confirmBooking: () => void
  confirmCheckIn: () => void
  confirmRevocation: () => void
  approveConsent: () => void
  rejectConsent: () => void
  activateEmergency: () => void
  endEmergency: () => void
}

// /profile/me returns the raw UserProfile document; normalize to the same
// shape OTP verification returns.
function profileToUser(p: any): SessionUser {
  return {
    id: String(p.accountId ?? p._id ?? ""),
    fullName: p.fullName ?? p.name ?? null,
    wrId: p.wrId ?? null,
    memberId: p.wrId ?? p.memberId ?? null,
    phoneNumber: p.phone ?? null,
    email: p.email ?? null,
    dateOfBirth: p.dateOfBirth ?? p.dob ?? null,
    bloodType: p.bloodType ?? null,
    genotype: p.genotype ?? null,
    allergies: typeof p.allergies === "string" ? p.allergies : null,
  }
}

const WelliContext = createContext<WelliContextType | undefined>(undefined)

export function WelliProvider({ children }: { children: React.ReactNode }) {
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [setupFlow, setSetupFlow] = useState(false)
  const [recordAdded, setRecordAdded] = useState(false)
  const [careStage, setCareStage] = useState<CareStage>("scheduled")
  const [activeConsent, setActiveConsent] = useState(true)
  const [pendingConsent, setPendingConsent] = useState<PendingConsent>("pending")
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyOfflineProfile | null>(null)

  // Resolve the stored session once on mount. A person counts as signed in
  // only with BOTH a token and the finished-onboarding flag, so quitting
  // mid-signup lands back on the welcome screen instead of an empty home.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [token, setupDone] = await Promise.all([
        storage.getItem(TOKEN_KEY),
        storage.getItem(SETUP_COMPLETE_KEY),
      ])
      if (cancelled) return
      const signedIn = Boolean(token) && setupDone === "true"
      setIsAuthenticated(signedIn)
      setIsAuthReady(true)
      if (signedIn) {
        // Best effort: fill in the profile without blocking the first paint.
        fetchProfile()
          .then((profile) => {
            if (!cancelled && profile) setUser(profileToUser(profile))
          })
          .catch(() => {})
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // An authenticated request that comes back 401 means the token expired or
  // was revoked: drop the session and send the person to sign in.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      storage.removeItem(TOKEN_KEY)
      storage.removeItem(SETUP_COMPLETE_KEY)
      clearRecordsCache()
      setUser(null)
      setIsAuthenticated(false)
      router.replace("/sign-in")
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  // Initialize offline and emergency caching
  useEffect(() => {
    offlineSyncService.getEmergencyProfile().then(setEmergencyProfile)
    const unsubscribe = offlineSyncService.subscribeNetwork((online) => {
      setIsOffline(!online)
    })
    return () => unsubscribe()
  }, [])

  const toggleOfflineMode = () => {
    const next = !isOffline
    setIsOffline(next)
    offlineSyncService.setSimulatedOffline(next)
    hapticFeedback.warning()
    if (next) {
      router.push("/offline")
    }
  }

  const addRecord = () => {
    hapticFeedback.success()
    setRecordAdded(true)
    if (setupFlow) {
      storage.setItem(SETUP_COMPLETE_KEY, "true")
      setSetupFlow(false)
      setIsAuthenticated(true)
    }
    router.push("/record-added")
  }

  const startAccountCreation = () => {
    hapticFeedback.light()
    setSetupFlow(true)
    router.push("/create-account")
  }

  // Called once onboarding finishes (after onboarding-record). Marks setup
  // complete and drops the whole auth stack for the tabs.
  const completeOnboarding = (target: "home" | "records" = "home") => {
    hapticFeedback.success()
    storage.setItem(SETUP_COMPLETE_KEY, "true")
    setSetupFlow(false)
    setIsAuthenticated(true)
    router.replace(target === "records" ? "/(tabs)/records" : "/(tabs)/home")
  }

  const establishSession = async (session: AuthSession) => {
    await storage.setItem(TOKEN_KEY, session.token)
    setUser(session.user)
    // The verify response is a trimmed profile; load the full one (allergies
    // and the rest) in the background.
    fetchProfile()
      .then((profile) => {
        if (profile) setUser(profileToUser(profile))
      })
      .catch(() => {})
  }

  // Existing account, code verified: mark setup done and enter the tabs.
  const signIn = () => {
    hapticFeedback.success()
    storage.setItem(SETUP_COMPLETE_KEY, "true")
    setSetupFlow(false)
    setIsAuthenticated(true)
    router.replace("/(tabs)/home")
  }

  const signOut = () => {
    hapticFeedback.light()
    // Clear the persisted session too, otherwise the next cold start reads
    // it back and drops the person straight into the tabs.
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(SETUP_COMPLETE_KEY)
    clearRecordsCache()
    setUser(null)
    setIsAuthenticated(false)
    router.replace("/sign-in")
  }

  const confirmBooking = () => {
    hapticFeedback.success()
    setCareStage("booked")
    router.push("/booking-confirmed")
  }

  const confirmCheckIn = () => {
    hapticFeedback.success()
    setCareStage("checkedIn")
    router.push("/checked-in")
  }

  const confirmRevocation = () => {
    hapticFeedback.warning()
    setActiveConsent(false)
    router.push("/(tabs)/consent-expanded")
  }

  const approveConsent = () => {
    hapticFeedback.success()
    setPendingConsent("approved")
  }

  const rejectConsent = () => {
    hapticFeedback.warning()
    setPendingConsent("rejected")
  }

  const activateEmergency = () => {
    hapticFeedback.heavy()
    setEmergencyActive(true)
    router.push("/emergency-info")
  }

  const endEmergency = () => {
    hapticFeedback.medium()
    setEmergencyActive(false)
    router.push("/emergency-qr")
  }

  return (
    <WelliContext.Provider
      value={{
        isAuthReady,
        isAuthenticated,
        user,
        setupFlow,
        recordAdded,
        careStage,
        activeConsent,
        pendingConsent,
        emergencyActive,
        isOffline,
        emergencyProfile,
        toggleOfflineMode,
        addRecord,
        startAccountCreation,
        completeOnboarding,
        establishSession,
        signIn,
        signOut,
        confirmBooking,
        confirmCheckIn,
        confirmRevocation,
        approveConsent,
        rejectConsent,
        activateEmergency,
        endEmergency,
      }}
    >
      {children}
    </WelliContext.Provider>
  )
}

export function useWelli() {
  const context = useContext(WelliContext)
  if (!context) {
    throw new Error("useWelli must be used within a WelliProvider")
  }
  return context
}
