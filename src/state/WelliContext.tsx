import React, { createContext, useContext, useEffect, useState } from "react"
import { router } from "expo-router"
import { CareStage, PendingConsent } from "../types/navigation"
import { hapticFeedback } from "../utils/haptics"
import { storage } from "../utils/storage"
import { offlineSyncService, EmergencyOfflineProfile } from "../services/offlineSyncService"
import { authenticateWithBiometrics } from "../utils/biometrics"

const SETUP_COMPLETE_KEY = "wellirecord-setup-complete"

interface WelliContextType {
  // Auth/onboarding gate. isAuthReady flips true once the stored flag has
  // been read (SecureStore/localStorage is async) — the root route waits
  // for this before deciding whether to show the auth stack or the tabs.
  isAuthReady: boolean
  isAuthenticated: boolean
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
  signIn: () => void
  signInWithBiometrics: () => Promise<boolean>
  signOut: () => void
  confirmBooking: () => void
  confirmCheckIn: () => void
  confirmRevocation: () => void
  approveConsent: () => void
  rejectConsent: () => void
  activateEmergency: () => void
  endEmergency: () => void
}

const WelliContext = createContext<WelliContextType | undefined>(undefined)

export function WelliProvider({ children }: { children: React.ReactNode }) {
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [setupFlow, setSetupFlow] = useState(false)
  const [recordAdded, setRecordAdded] = useState(false)
  const [careStage, setCareStage] = useState<CareStage>("scheduled")
  const [activeConsent, setActiveConsent] = useState(true)
  const [pendingConsent, setPendingConsent] = useState<PendingConsent>("pending")
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyOfflineProfile | null>(null)

  // Resolve the stored "has this person finished onboarding" flag once on
  // mount (SecureStore/localStorage is async, unlike the old synchronous
  // window.localStorage read this replaced).
  useEffect(() => {
    storage.getItem(SETUP_COMPLETE_KEY).then((value) => {
      setIsAuthenticated(value === "true")
      setIsAuthReady(true)
    })
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

  const signIn = () => {
    hapticFeedback.success()
    storage.setItem(SETUP_COMPLETE_KEY, "true")
    setSetupFlow(false)
    setIsAuthenticated(true)
    router.replace("/(tabs)/home")
  }

  const signInWithBiometrics = async (): Promise<boolean> => {
    hapticFeedback.medium()
    const res = await authenticateWithBiometrics("Verify Face ID to unlock WelliRecord")
    if (res.success) {
      signIn()
      return true
    }
    hapticFeedback.error()
    return false
  }

  const signOut = () => {
    hapticFeedback.light()
    // Clear the persisted flag too, otherwise the next cold start reads
    // "true" and drops the person straight back into the tabs.
    storage.removeItem(SETUP_COMPLETE_KEY)
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
        signIn,
        signInWithBiometrics,
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
