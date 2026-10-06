import React, { useState } from "react"
import { Screen, screenTitles } from "../../types/navigation"

export function MobileDeviceFrame({
  children,
  currentScreen,
  onScreenChange,
  isOffline = false,
  onToggleOffline,
  onTriggerEmergency,
}: {
  children: React.ReactNode
  currentScreen: Screen
  onScreenChange: (screen: Screen) => void
  isOffline?: boolean
  onToggleOffline?: () => void
  onTriggerEmergency?: () => void
}) {
  const [device, setDevice] = useState<"iphone" | "pixel" | "full">("iphone")
  const [currentTime] = useState("09:41")

  return (
    <div className="min-h-screen bg-[#071329] text-[#031f50] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4">
      {/* Top Simulator Control Bar */}
      <div className="hidden sm:flex w-full max-w-4xl items-center justify-between mb-4 px-4 py-2 bg-[#0e1d38] border border-[#1e345e] rounded-2xl text-xs text-white shadow-xl backdrop-blur gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="font-bold tracking-wide text-[#94a9cc]">
            WelliRecord <span className="text-white">Mobile Studio</span>
          </span>
          <span className="hidden md:inline text-[11px] px-2 py-0.5 rounded-full bg-[#1b2b4e] text-[#60a5fa] border border-[#2e4575]">
            40 Native Screens
          </span>
        </div>

        {/* Action Toggles: Offline & Emergency */}
        <div className="flex items-center gap-2">
          {onToggleOffline && (
            <button
              onClick={onToggleOffline}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isOffline
                  ? "bg-[#eab308] text-[#422006] shadow ring-2 ring-yellow-400/50"
                  : "bg-[#1b2b4e] text-[#94a9cc] hover:text-white border border-[#2e4575]"
              }`}
              title="Toggle simulated offline clinic mode"
            >
              <span className={`size-1.5 rounded-full ${isOffline ? "bg-[#854d0e]" : "bg-[#10b981]"}`} />
              {isOffline ? "Offline Mode (Simulated)" : "Online"}
            </button>
          )}

          {onTriggerEmergency && (
            <button
              onClick={onTriggerEmergency}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#ef4444]/20 text-[#fca5a5] hover:bg-[#ef4444]/30 border border-[#ef4444]/40 flex items-center gap-1 transition-all"
              title="Quick test emergency medical QR"
            >
              🚨 Emergency ID
            </button>
          )}
        </div>

        {/* Screen Quick Jump */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-[#94a9cc] font-medium hidden lg:inline">
            Jump:
          </label>
          <select
            className="bg-[#1b2b4e] border border-[#2e4575] text-white rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer max-w-[200px] truncate"
            value={currentScreen}
            onChange={(e) => onScreenChange(e.target.value as Screen)}
          >
            {Object.entries(screenTitles).map(([id, title]) => (
              <option key={id} value={id}>
                {id}: {title}
              </option>
            ))}
          </select>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#132342] p-1 rounded-xl border border-[#253b66]">
          <button
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              device === "iphone"
                ? "bg-[#2563eb] text-white shadow"
                : "text-[#94a9cc] hover:text-white"
            }`}
            onClick={() => setDevice("iphone")}
            title="iPhone 16 Pro View"
          >
            iPhone
          </button>
          <button
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              device === "pixel"
                ? "bg-[#2563eb] text-white shadow"
                : "text-[#94a9cc] hover:text-white"
            }`}
            onClick={() => setDevice("pixel")}
            title="Google Pixel 9 View"
          >
            Pixel
          </button>
          <button
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              device === "full"
                ? "bg-[#2563eb] text-white shadow"
                : "text-[#94a9cc] hover:text-white"
            }`}
            onClick={() => setDevice("full")}
            title="Full Width Responsive"
          >
            Responsive
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          device === "iphone"
            ? "sm:max-w-[420px] sm:rounded-[50px] sm:border-[10px] sm:border-[#222b3d] sm:shadow-2xl sm:overflow-hidden sm:ring-1 sm:ring-white/10"
            : device === "pixel"
              ? "sm:max-w-[412px] sm:rounded-[40px] sm:border-[8px] sm:border-[#1d2636] sm:shadow-2xl sm:overflow-hidden sm:ring-1 sm:ring-white/10"
              : "w-full max-w-4xl sm:rounded-2xl sm:shadow-xl sm:overflow-hidden"
        }`}
      >
        {/* Device Top Status Bar (Only in frame view) */}
        {device !== "full" && (
          <div className="hidden sm:flex items-center justify-between px-7 pt-3.5 pb-2 bg-white text-[#031f50] border-b border-[#f0f4fa] select-none text-xs font-semibold relative z-30">
            <span>{currentTime}</span>
            {/* Dynamic Island / Punch Hole */}
            {device === "iphone" ? (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[96px] h-[24px] bg-black rounded-full flex items-center justify-end pr-2.5">
                <span className="size-2.5 rounded-full bg-[#111e38] ring-1 ring-[#223558]" />
              </div>
            ) : (
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 size-3.5 bg-black rounded-full" />
            )}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Actual Mobile App Screen Container */}
        <div className="bg-[#f7f9fc] min-h-dvh sm:min-h-[850px] max-h-[92vh] sm:overflow-y-auto relative flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}
