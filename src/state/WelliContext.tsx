import React, { createContext, useContext, useEffect, useState } from "react"
import { CareStage, PendingConsent, Screen, TabId } from "../types/navigation"
import { hapticFeedback } from "../utils/haptics"
import { offlineSyncService, EmergencyOfflineProfile } from "../services/offlineSyncService"
import { authenticateWithBiometrics } from "../utils/biometrics"
import { recordsService } from "../services/recordsService"

interface WelliContextType {
  screen: Screen
  screenHistory: Screen[]
  setupFlow: boolean
  recordAdded: boolean
  careStage: CareStage
  activeConsent: boolean
  pendingConsent: PendingConsent
  emergencyActive: boolean
  activeSection: TabId
  showNavigation: boolean
  canGoBack: boolean
  deviceMode: "iphone" | "pixel" | "responsive"
  isOffline: boolean
  emergencyProfile: EmergencyOfflineProfile | null
  setDeviceMode: (mode: "iphone" | "pixel" | "responsive") => void
  toggleOfflineMode: () => void
  go: (next: Screen) => void
  goBack: () => void
  openSection: (next: TabId) => void
  addRecord: () => void
  startAccountCreation: () => void
  completeOnboarding: (next: Screen) => void
  signIn: () => void
  signInWithBiometrics: () => Promise<boolean>
  signOut: () => void
  confirmBooking: () => void
  confirmCheckIn: () => void
  confirmRevocation: () => void
  activateEmergency: () => void
  endEmergency: () => void
}

const WelliContext = createContext<WelliContextType | undefined>(undefined)

const entryScreens: Screen[] = [
  "welcome",
  "signIn",
  "createAccount",
  "verifyPhone",
  "onboardingId",
  "onboardingRecord",
  "recoverAccount",
  "verifyRecovery",
  "recovered",
]

const healthScreens: Screen[] = [
  "records",
  "timeline",
  "reports",
  "result",
  "medications",
  "emptyVault",
  "offline",
  "uploadFailed",
  "labsLoading",
  "recordChat",
  "uploadReview",
  "healthPassport",
  "recordAdded",
]

const careScreens: Screen[] = [
  "careDiscovery",
  "bookingTime",
  "bookingReview",
  "bookingConfirmed",
  "visitPrep",
  "checkIn",
  "checkedIn",
  "careJourney",
]

const shareScreens: Screen[] = [
  "consentExpanded",
  "revoke",
  "shared",
  "recordActivity",
]

export function WelliProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>(() => {
    if (typeof window === "undefined") return "welcome"
    return window.localStorage.getItem("wellirecord-setup-complete") === "true"
      ? "home"
      : "welcome"
  })
  const [screenHistory, setScreenHistory] = useState<Screen[]>([])
  const [setupFlow, setSetupFlow] = useState(false)
  const [recordAdded, setRecordAdded] = useState(false)
  const [careStage, setCareStage] = useState<CareStage>("scheduled")
  const [activeConsent, setActiveConsent] = useState(true)
  const [pendingConsent, setPendingConsent] = useState<PendingConsent>("pending")
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [deviceMode, setDeviceMode] = useState<"iphone" | "pixel" | "responsive">("iphone")
  const [isOffline, setIsOffline] = useState(false)
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyOfflineProfile | null>(null)

  // Initialize offline and emergency caching
  useEffect(() => {
    offlineSyncService.getEmergencyProfile().then(setEmergencyProfile)
    const unsubscribe = offlineSyncService.subscribeNetwork((online) => {
      setIsOffline(!online)
    })
    return () => unsubscribe()
  }, [])

  const mainTabs: TabId[] = ["home", "records", "careDiscovery", "consentExpanded", "profile"]
  const isMainTab = mainTabs.includes(screen as TabId)
  const showNavigation = !entryScreens.includes(screen)

  const activeSection: TabId =
    screen === "home"
      ? "home"
      : healthScreens.includes(screen)
        ? "records"
        : careScreens.includes(screen)
          ? "careDiscovery"
          : shareScreens.includes(screen)
            ? "consentExpanded"
            : "profile"

  const toggleOfflineMode = () => {
    const next = !isOffline
    setIsOffline(next)
    offlineSyncService.setSimulatedOffline(next)
    hapticFeedback.warning()
    if (next) {
      go("offline")
    }
  }

  const go = (next: Screen) => {
    if (next === screen) return
    hapticFeedback.selection()
    setScreenHistory((prev) => [...prev, screen])
    setScreen(next)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goBack = () => {
    hapticFeedback.light()
    setScreenHistory((prev) => {
      const last = prev.at(-1)
      if (!last) return prev
      setScreen(last)
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return prev.slice(0, -1)
    })
  }

  const openSection = (next: TabId) => {
    hapticFeedback.selection()
    setScreenHistory([])
    setScreen(next as Screen)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const addRecord = () => {
    hapticFeedback.success()
    setRecordAdded(true)
    if (setupFlow && typeof window !== "undefined") {
      window.localStorage.setItem("wellirecord-setup-complete", "true")
      setSetupFlow(false)
    }
    go("recordAdded")
  }

  const startAccountCreation = () => {
    hapticFeedback.light()
    setSetupFlow(true)
    go("createAccount")
  }

  const completeOnboarding = (next: Screen) => {
    hapticFeedback.success()
    if (typeof window !== "undefined") {
      window.localStorage.setItem("wellirecord-setup-complete", "true")
    }
    setSetupFlow(false)
    setScreenHistory([])
    setScreen(next)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const signIn = () => {
    hapticFeedback.success()
    setSetupFlow(false)
    setScreenHistory([])
    setScreen("home")
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
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
    setScreenHistory([])
    setScreen("signIn")
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const confirmBooking = () => {
    hapticFeedback.success()
    setCareStage("booked")
    go("bookingConfirmed")
  }

  const confirmCheckIn = () => {
    hapticFeedback.success()
    setCareStage("checkedIn")
    go("checkedIn")
  }

  const confirmRevocation = () => {
    hapticFeedback.warning()
    setActiveConsent(false)
    go("consentExpanded")
  }

  const activateEmergency = () => {
    hapticFeedback.heavy()
    setEmergencyActive(true)
    go("emergencyInfo")
  }

  const endEmergency = () => {
    hapticFeedback.medium()
    setEmergencyActive(false)
    go("emergencyQr")
  }

  return (
    <WelliContext.Provider
      value={{
        screen,
        screenHistory,
        setupFlow,
        recordAdded,
        careStage,
        activeConsent,
        pendingConsent,
        emergencyActive,
        activeSection,
        showNavigation,
        canGoBack: !isMainTab && screenHistory.length > 0,
        deviceMode,
        isOffline,
        emergencyProfile,
        setDeviceMode,
        toggleOfflineMode,
        go,
        goBack,
        openSection,
        addRecord,
        startAccountCreation,
        completeOnboarding,
        signIn,
        signInWithBiometrics,
        signOut,
        confirmBooking,
        confirmCheckIn,
        confirmRevocation,
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
