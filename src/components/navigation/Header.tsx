import React from "react"
import { Icon } from "../common"
import { icons } from "../../constants/icons"
import { Screen, screenTitles, TabId } from "../../types/navigation"

export function Header({
  screen,
  canGoBack,
  onGoBack,
  onOpenProfile,
  onOpenNotifications,
  onHelp,
}: {
  screen: Screen
  canGoBack: boolean
  onGoBack: () => void
  onOpenProfile: () => void
  onOpenNotifications?: () => void
  onHelp?: () => void
}) {
  const helpScreens: Screen[] = [
    "welcome",
    "signIn",
    "createAccount",
    "verifyPhone",
    "onboardingId",
    "onboardingRecord",
    "recoverAccount",
    "verifyRecovery",
    "preferences",
  ]
  const headerAction = helpScreens.includes(screen)
    ? "help"
    : screen === "home"
      ? "notifications"
      : "avatar"

  return (
    <header className="app-header sticky top-0 z-20 border-b border-[#e7ecf4] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-4xl items-center gap-3 px-[22px]">
        {canGoBack && (
          <button
            aria-label="Go back"
            className="flex size-9 items-center justify-center rounded-full bg-[#edf2fa] text-xl font-medium text-[#031f50] transition-transform active:scale-90"
            onClick={onGoBack}
          >
            ‹
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold tracking-[-0.02em] text-[#24518c]">
            Welli<span className="text-[#031f50]">Record</span>
          </p>
          <h1 className="truncate text-lg font-bold text-[#031f50]">
            {screenTitles[screen]}
          </h1>
        </div>
        {headerAction === "help" && (
          <button
            className="text-sm font-semibold text-[#031f50] transition-opacity hover:opacity-80"
            onClick={onHelp}
          >
            Help
          </button>
        )}
        {headerAction === "notifications" && (
          <button
            aria-label="Notifications"
            className="flex size-10 items-center justify-center rounded-full bg-[#edf2fa] transition-transform active:scale-95"
            onClick={onOpenNotifications}
          >
            <Icon src={icons.bell} />
          </button>
        )}
        {headerAction === "avatar" && (
          <button
            aria-label="Open profile"
            className="flex size-10 items-center justify-center rounded-full bg-[#edf2fa] text-xs font-bold text-[#031f50] transition-transform active:scale-95"
            onClick={onOpenProfile}
          >
            AO
          </button>
        )}
      </div>
    </header>
  )
}
