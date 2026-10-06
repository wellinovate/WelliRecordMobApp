import React from "react"
import { BottomTabBar } from "./components/navigation/BottomTabBar"
import { Header } from "./components/navigation/Header"
import { MobileDeviceFrame } from "./components/simulator/MobileDeviceFrame"
import {
  BookingConfirmedScreen,
  BookingReviewScreen,
  BookingTimeScreen,
  CareDiscoveryScreen,
  CareJourneyScreen,
  CheckedInScreen,
  CheckInScreen,
  VisitPrepScreen,
} from "./screens/CareBookingScreens"
import {
  ConsentExpandedScreen,
  EmergencyInfoScreen,
  EmergencyQrScreen,
  HealthPassportScreen,
  RecordActivityScreen,
} from "./screens/ConsentAndPassportScreens"
import {
  CreateAccountScreen,
  OnboardingIdScreen,
  OnboardingRecordScreen,
  SignInScreen,
  VerifyPhoneScreen,
  WelcomeScreen,
} from "./screens/AuthScreens"
import { HomeScreen } from "./screens/HomeScreen"
import { MedicationsScreen } from "./screens/MedicationsScreen"
import { OutcomeScreen } from "./screens/OutcomeScreen"
import { PreferencesScreen } from "./screens/PreferencesScreen"
import { ProfileScreen } from "./screens/ProfileScreen"
import { RecordsScreen } from "./screens/RecordsScreen"
import { ReportsScreen } from "./screens/ReportsScreen"
import { ResultScreen } from "./screens/ResultScreen"
import {
  LostPhoneScreen,
  RecoverAccountScreen,
  RecoveredScreen,
  VerifyRecoveryScreen,
} from "./screens/SecurityScreens"
import { TimelineScreen } from "./screens/TimelineScreen"
import {
  RecordAddedScreen,
  RecordChatScreen,
  UploadReviewScreen,
} from "./screens/UploadAndChatScreens"
import {
  EmptyVaultScreen,
  LabsLoadingScreen,
  OfflineScreen,
  UploadFailedScreen,
} from "./screens/VaultAndOfflineScreens"
import { useWelli, WelliProvider } from "./state/WelliContext"

function MainApp() {
  const {
    screen,
    canGoBack,
    goBack,
    go,
    openSection,
    activeSection,
    showNavigation,
    careStage,
    recordAdded,
    activeConsent,
    pendingConsent,
    emergencyActive,
    isOffline,
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
    activateEmergency,
    endEmergency,
  } = useWelli()

  return (
    <MobileDeviceFrame
      currentScreen={screen}
      onScreenChange={go}
      isOffline={isOffline}
      onToggleOffline={toggleOfflineMode}
      onTriggerEmergency={activateEmergency}
    >
      <Header
        canGoBack={canGoBack}
        onGoBack={goBack}
        onOpenNotifications={() => alert("Notification Center: 2 new alerts from Dr. Bello and SYNLAB")}
        onOpenProfile={() => openSection("profile")}
        onHelp={() => alert("WelliRecord Patient Help & Support Desk")}
        screen={screen}
      />

      <main
        className={`w-full px-[22px] pt-5 flex-1 ${
          showNavigation ? "pb-28" : "pb-8"
        }`}
      >
        {screen === "home" && <HomeScreen careStage={careStage} go={go} />}
        {screen === "records" && (
          <RecordsScreen go={go} recordAdded={recordAdded} />
        )}
        {screen === "timeline" && <TimelineScreen go={go} />}
        {screen === "reports" && <ReportsScreen go={go} />}
        {screen === "result" && <ResultScreen go={go} />}
        {screen === "medications" && <MedicationsScreen />}
        {screen === "profile" && <ProfileScreen go={go} onSignOut={signOut} />}
        {screen === "revoke" && (
          <OutcomeScreen
            go={go}
            kind="revoke"
            onConfirmRevoke={confirmRevocation}
          />
        )}
        {screen === "shared" && <OutcomeScreen go={go} kind="shared" />}
        {screen === "lostPhone" && <LostPhoneScreen go={go} />}
        {screen === "recovered" && <RecoveredScreen go={go} />}
        {screen === "verifyRecovery" && <VerifyRecoveryScreen go={go} />}
        {screen === "recoverAccount" && <RecoverAccountScreen go={go} />}
        {screen === "emptyVault" && <EmptyVaultScreen go={go} />}
        {screen === "preferences" && <PreferencesScreen go={go} />}
        {screen === "createAccount" && <CreateAccountScreen go={go} />}
        {screen === "welcome" && (
          <WelcomeScreen go={go} onCreateAccount={startAccountCreation} />
        )}
        {screen === "signIn" && (
          <SignInScreen
            go={go}
            onCreateAccount={startAccountCreation}
            onSignIn={signIn}
            onBiometricSignIn={signInWithBiometrics}
          />
        )}
        {screen === "bookingReview" && (
          <BookingReviewScreen go={go} onConfirm={confirmBooking} />
        )}
        {screen === "bookingTime" && <BookingTimeScreen go={go} />}
        {screen === "offline" && <OfflineScreen go={go} />}
        {screen === "uploadFailed" && <UploadFailedScreen go={go} />}
        {screen === "labsLoading" && <LabsLoadingScreen go={go} />}
        {screen === "onboardingRecord" && (
          <OnboardingRecordScreen go={go} onComplete={completeOnboarding} />
        )}
        {screen === "onboardingId" && <OnboardingIdScreen go={go} />}
        {screen === "verifyPhone" && <VerifyPhoneScreen go={go} />}
        {screen === "checkedIn" && <CheckedInScreen go={go} />}
        {screen === "checkIn" && <CheckInScreen onCheckIn={confirmCheckIn} />}
        {screen === "bookingConfirmed" && <BookingConfirmedScreen go={go} />}
        {screen === "recordChat" && <RecordChatScreen go={go} />}
        {screen === "careDiscovery" && <CareDiscoveryScreen go={go} />}
        {screen === "visitPrep" && <VisitPrepScreen go={go} />}
        {screen === "careJourney" && <CareJourneyScreen go={go} />}
        {screen === "uploadReview" && <UploadReviewScreen onAdd={addRecord} />}
        {screen === "recordAdded" && <RecordAddedScreen go={go} />}
        {screen === "consentExpanded" && (
          <ConsentExpandedScreen
            activeConsent={activeConsent}
            go={go}
            onApprove={() => {}}
            onReject={() => {}}
            pendingConsent={pendingConsent}
          />
        )}
        {screen === "recordActivity" && (
          <RecordActivityScreen
            activeConsent={activeConsent}
            pendingConsent={pendingConsent}
          />
        )}
        {screen === "emergencyQr" && (
          <EmergencyQrScreen
            active={emergencyActive}
            onActivate={activateEmergency}
          />
        )}
        {screen === "emergencyInfo" && (
          <EmergencyInfoScreen onEnd={endEmergency} />
        )}
        {screen === "healthPassport" && <HealthPassportScreen />}
      </main>

      {showNavigation && (
        <BottomTabBar activeTab={activeSection} onSelectTab={openSection} />
      )}
    </MobileDeviceFrame>
  )
}

export default function App() {
  return (
    <WelliProvider>
      <MainApp />
    </WelliProvider>
  )
}
