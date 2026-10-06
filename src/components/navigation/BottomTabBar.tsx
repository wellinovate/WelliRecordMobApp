import React from "react"
import { Icon } from "../common"
import { icons } from "../../constants/icons"
import { TabId } from "../../types/navigation"

export const navItems = [
  ["home", icons.homeNav, "Home"],
  ["records", icons.clipboard, "My Health"],
  ["careDiscovery", icons.stethoscope, "Care"],
  ["consentExpanded", icons.send, "Share"],
  ["profile", icons.fingerprint, "Profile"],
] as const

export function BottomTabBar({
  activeTab,
  onSelectTab,
}: {
  activeTab: TabId
  onSelectTab: (tab: TabId) => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#dae2ee] bg-white pb-[max(8px,env(safe-area-inset-bottom))] shadow-lg">
      <div className="mx-auto grid h-[68px] max-w-4xl grid-cols-5 px-2">
        {navItems.map(([id, icon, label]) => {
          const isActive = activeTab === id
          return (
            <button
              className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-colors ${
                isActive ? "text-[#031f50]" : "text-[#718096] hover:text-[#031f50]"
              }`}
              key={id}
              onClick={() => onSelectTab(id as TabId)}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-all ${
                  isActive ? "bg-[#edf2fa] scale-105" : ""
                }`}
              >
                <Icon size={19} src={icon} />
              </span>
              {label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
