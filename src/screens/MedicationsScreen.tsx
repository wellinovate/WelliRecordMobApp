import React, { useState } from "react"
import { Badge, Card, Guidance, Icon, Row, SectionTitle } from "../components/common"
import { icons } from "../constants/icons"

export function MedicationsScreen() {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current")
  const [taken, setTaken] = useState(false)

  return (
    <div className="stack">
      <div className="grid grid-cols-2 rounded-[14px] bg-[#edf2fa] p-1">
        <button
          className={`rounded-[11px] py-2.5 text-xs font-semibold transition-all ${
            activeTab === "current"
              ? "bg-white text-[#031f50] shadow-sm"
              : "text-[#53657c]"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Current · 2
        </button>
        <button
          className={`rounded-[11px] py-2.5 text-xs font-semibold transition-all ${
            activeTab === "past"
              ? "bg-white text-[#031f50] shadow-sm"
              : "text-[#53657c]"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past · 1
        </button>
      </div>

      <Card className="bg-[#edf2fa]">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold text-[#031f50]">
            This week’s routine
          </p>
          <span className="text-[11px] font-semibold text-[#031f50]">
            6 of 7 taken
          </span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div className="text-center" key={`${d}-${i}`}>
              <span
                className={`mx-auto flex size-8 items-center justify-center rounded-full transition-transform active:scale-90 ${
                  i === 4 ? "bg-white shadow-sm" : "bg-[#031f50] text-white"
                }`}
              >
                <Icon
                  size={15}
                  src={i === 4 ? icons.minus : icons.check}
                />
              </span>
              <span className="mt-1 block text-[10px] text-[#53657c]">{d}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-[#53657c]">
          Amlodipine: 6 Taken, 1 Skipped. Self-reported dose logs, not proof of
          use.
        </p>
      </Card>

      <SectionTitle>Today · 3 October</SectionTitle>
      <Card>
        <div className="flex items-center justify-between">
          <Icon src={icons.pill} />
          <Badge tone="amber">8:00 PM reminder</Badge>
        </div>
        <h2 className="mt-4 text-lg font-bold text-[#031f50]">
          Ferrous sulfate · 200 mg
        </h2>
        <p className="mt-3 text-sm leading-[1.45] text-[#173b71]">
          1 tablet by mouth · Once daily
          <br />
          Take after food, as prescribed.
        </p>
        <p className="mt-4 text-xs text-[#53657c]">
          Dr Amaka Bello · 28 Sep 2026
          <br />
          Dispensed: HealthPlus Ikeja · 30 Sep
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className={`h-12 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
              taken ? "bg-[#edf2fa] text-[#031f50]" : "bg-[#031f50] text-white"
            }`}
            onClick={() => setTaken(!taken)}
          >
            {taken ? "Undo taken" : "✓  Taken"}
          </button>
          <button className="h-12 rounded-xl border border-[#dae2ee] bg-white text-sm font-semibold text-[#031f50] transition-colors hover:bg-[#edf2fa] active:scale-[0.98]">
            Snooze
          </button>
        </div>
        <button className="mt-3 w-full text-xs font-semibold text-[#53657c] hover:underline">
          Mark skipped · Add a reason
        </button>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#031f50]">
            Amlodipine · 5 mg
          </h2>
          <Badge>Taken</Badge>
        </div>
        <p className="mt-3 text-sm text-[#173b71]">
          1 tablet by mouth · Once daily
          <br />
          Take at the same time each morning.
        </p>
        <p className="mt-4 text-xs text-[#53657c]">
          Today’s dose logged at 8:06 AM
        </p>
        <div className="mt-3">
          <Badge>Verified prescription</Badge>
        </div>
      </Card>

      <Guidance title="Safety information, not prescribing advice" tone="amber">
        Penicillin allergy is on your record. Ask your clinician or pharmacist
        before changes.
      </Guidance>

      <Row
        detail="8:00 AM & 8:00 PM · Notifications enabled"
        icon={icons.bell}
        title="Reminder preferences"
      />
    </div>
  )
}
