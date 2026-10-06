import React, { useState } from "react"
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  SectionTitle,
} from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export const sampleReports = [
  [
    "Haemoglobin",
    "12 Aug 2026 · SYNLAB Ikeja",
    "Haemoglobin · 11.1 g/dL",
    "Source not verified",
  ],
  [
    "Lipid profile",
    "18 Jun 2026 · Lagoon Hospital, Ikeja",
    "Transferred from an external record",
    "Imported",
  ],
  [
    "Kidney function",
    "18 Jun 2026 · SYNLAB Ikeja",
    "Issued by the laboratory",
    "Verified provider",
  ],
  [
    "Fasting blood glucose",
    "21 Mar 2026 · Medbury Medical Services",
    "Uploaded by you · source not verified",
    "Patient Added",
  ],
  [
    "Urinalysis",
    "10 Feb 2026 · Lagoon Hospital, Ikeja",
    "Uploaded by you · source not verified",
    "Patient Added",
  ],
] as const

export function ReportsScreen({ go }: { go: (screen: Screen) => void }) {
  const [search, setSearch] = useState("")

  const filteredReports = sampleReports.filter(
    ([name, date]) =>
      name.toLowerCase().includes(search.toLowerCase()) ||
      date.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="stack">
      <label className="flex h-[52px] items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm focus-within:border-[#24518c]">
        <Icon src={icons.search} />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#718096]"
          placeholder="Search a test or provider"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-[#718096] hover:text-[#031f50]"
          >
            Clear
          </button>
        )}
      </label>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All dates", "Provider", "Source"].map((x) => (
          <button
            className="rounded-full border border-[#dae2ee] bg-white px-3 py-2 text-xs font-semibold text-[#031f50] hover:bg-[#edf2fa]"
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-sm font-semibold text-[#031f50]">
        <span>6 reports</span>
        <span>Newest first</span>
      </div>
      <Card onClick={() => go("result")}>
        <div className="flex justify-between text-[11px] font-semibold text-[#173b71]">
          <span>LATEST REPORT</span>
          <span>Verified provider</span>
        </div>
        <h2 className="mt-3 text-lg font-bold text-[#031f50]">
          Full blood count
        </h2>
        <p className="mt-1 text-xs text-[#53657c]">
          29 Sep 2026 · SYNLAB Ikeja
        </p>
        <div className="mt-4 rounded-xl bg-[#fbf2e3] p-3">
          <p className="text-sm font-semibold text-[#031f50]">
            Haemoglobin · 10.2 g/dL
          </p>
          <p className="mt-2 text-xs text-[#936020]">
            Below this lab’s range: 12.0–15.5 g/dL
          </p>
          <p className="mt-2 text-xs text-[#53657c]">
            This flag is for haemoglobin, not the whole panel.
          </p>
        </div>
        <div className="mt-4">
          <PrimaryButton onClick={() => go("result")}>
            Open latest report
          </PrimaryButton>
        </div>
      </Card>
      <SectionTitle>Earlier reports</SectionTitle>
      {filteredReports.map(([name, date, detail, source]) => (
        <Card className="p-4" key={name}>
          <p className="text-sm font-semibold text-[#031f50]">{name}</p>
          <p className="mt-1 text-xs text-[#53657c]">{date}</p>
          <p className="mt-3 text-xs text-[#53657c]">{detail}</p>
          <div className="mt-3">
            <Badge>{source}</Badge>
          </div>
        </Card>
      ))}
      <Guidance title="Source labels, not a medical assessment">
        Verified provider, Patient Added and Imported describe record
        provenance.
      </Guidance>
    </div>
  )
}
