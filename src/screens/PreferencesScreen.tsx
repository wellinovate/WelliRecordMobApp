import React, { useState } from "react"
import {
  Card,
  Choice,
  Guidance,
  PrimaryButton,
} from "../components/common"
import { Screen } from "../types/navigation"

function ScreenIntroHeader({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string
  title: string
  copy: string
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-bold text-[#031f50]">{title}</h2>
      <p className="mt-2 text-xs leading-[1.45] text-[#53657c]">{copy}</p>
    </div>
  )
}

export function PreferencesScreen({ go }: { go: (screen: Screen) => void }) {
  const [language, setLanguage] = useState("English")
  const [large, setLarge] = useState(true)
  const [contrast, setContrast] = useState(false)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Language and reading preferences can be changed later."
        eyebrow="PREFERENCES · AVAILABLE BEFORE SIGN-IN"
        title="Make it easier to use"
      />
      <div>
        <h3 className="text-lg font-bold text-[#031f50]">Choose a language</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {["English", "Pidgin", "Hausa", "Yoruba", "Igbo"].map((item) => (
            <button
              className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition-all ${
                language === item
                  ? "bg-[#031f50] text-white shadow-sm"
                  : "bg-[#edf2fa] text-[#173b71] hover:bg-[#e2eaf5]"
              }`}
              key={item}
              onClick={() => setLanguage(item)}
            >
              {language === item ? "✓ " : ""}
              {item}
            </button>
          ))}
        </div>
      </div>
      <Card>
        <Choice
          selected={large}
          onClick={() => setLarge(!large)}
          title={`Larger text · ${large ? "On" : "Off"}`}
          detail="Increase font size across all app screens"
        />
        <div className="mt-5 rounded-[14px] bg-[#edf2fa] p-4">
          <p className="text-xs font-semibold text-[#53657c]">
            LARGE-TEXT SAMPLE
          </p>
          <p className="mt-3 text-2xl font-bold leading-[1.25] text-[#031f50]">
            Choose who can see your records.
          </p>
          <p className="mt-3 text-lg text-[#173b71]">You can review and change access.</p>
        </div>
        <p className="mt-4 text-xs text-[#53657c]">
          Text wraps inside cards. Buttons and labels stay readable.
        </p>
      </Card>
      <Card className="space-y-4">
        <Choice
          selected={contrast}
          detail="Stronger borders and text contrast"
          onClick={() => setContrast(!contrast)}
          title={`High contrast · ${contrast ? "On" : "Off"}`}
        />
        <Choice
          selected
          detail="Meaningful labels and logical reading order"
          title="Screen-reader support · On"
        />
        <Choice
          selected
          detail="Prefer static changes over movement"
          title="Reduce motion · On"
        />
      </Card>
      <Guidance title="Clinical originals stay unchanged">
        Navigation and explanations may be translated. Original reports retain
        their source language and content.
      </Guidance>
      <PrimaryButton onClick={() => go("emptyVault")}>
        Save preferences
      </PrimaryButton>
    </div>
  )
}
