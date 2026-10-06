import React, { useState } from "react"
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  Row,
  SectionTitle,
} from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export const recordCategories = [
  [icons.stethoscope, "Medical", "4 records"],
  [icons.lab, "Laboratory", "6 reports"],
  [icons.imaging, "Imaging", "2 reports"],
  [icons.pill, "Medications", "2 current"],
  [icons.fileHeart, "Prescriptions", "3 records"],
  [icons.syringe, "Vaccinations", "3 records"],
  [icons.allergy, "Allergies", "1 confirmed"],
  [icons.activity, "Procedures", "1 record"],
  [icons.files, "Documents", "2 files"],
] as const

export function RecordsScreen({
  go,
  recordAdded,
}: {
  go: (screen: Screen) => void
  recordAdded: boolean
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = recordCategories.filter(([_, label]) =>
    label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="stack">
      <label className="flex h-[52px] items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm transition-all focus-within:border-[#24518c]">
        <Icon src={icons.search} />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#718096]"
          placeholder="Search a test, medicine or provider"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-[#718096] hover:text-[#031f50]"
          >
            Clear
          </button>
        )}
      </label>

      <Card>
        <Row
          detail="Ask questions using only the records you choose"
          icon={icons.sparklesRecord}
          title="Understand my records"
          onClick={() => go("recordChat")}
        />
      </Card>

      {recordAdded && (
        <Guidance title="Full blood count added">
          Your reviewed upload is now saved as Patient Added. The original file
          and AI extraction label were retained.
        </Guidance>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4" onClick={() => go("timeline")}>
          <Icon src={icons.history} />
          <p className="mt-4 text-sm font-semibold text-[#031f50]">
            Health timeline →
          </p>
          <p className="mt-2 text-xs text-[#53657c]">Your story over time</p>
        </Card>
        <Card className="p-4" onClick={() => go("healthPassport")}>
          <Icon src={icons.book} />
          <p className="mt-4 text-sm font-semibold text-[#031f50]">
            Health passport →
          </p>
          <p className="mt-2 text-xs text-[#53657c]">A portable summary</p>
        </Card>
      </div>

      <SectionTitle>Browse your records</SectionTitle>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filteredCategories.map(([icon, label, count]) => (
          <Card
            className="min-h-[124px] p-4 transition-all hover:shadow-md"
            key={label}
            onClick={
              label === "Laboratory"
                ? () => go("reports")
                : label === "Medications"
                  ? () => go("medications")
                  : label === "Medical"
                    ? () => go("timeline")
                    : undefined
            }
          >
            <Icon src={icon} />
            <p className="mt-4 text-sm font-semibold text-[#031f50]">{label}</p>
            <p className="mt-1 text-xs text-[#53657c]">{count}</p>
          </Card>
        ))}
      </div>

      <SectionTitle>Know where it came from</SectionTitle>
      <Card className="space-y-3 text-xs text-[#53657c]">
        <p>
          <Badge>Verified provider</Badge>{" "}
          <span className="ml-2">Issued by a participating care provider</span>
        </p>
        <p>
          <Badge>Patient Added</Badge>{" "}
          <span className="ml-2">Information or files you added</span>
        </p>
        <p>
          <Badge>Imported</Badge>{" "}
          <span className="ml-2">Transferred from an external record</span>
        </p>
      </Card>

      <Guidance title="1 document needs your review" tone="amber">
        AI extracted your uploaded report. Confirm the fields before adding it.
      </Guidance>

      <PrimaryButton onClick={() => go("uploadReview")}>
        Upload a health document
      </PrimaryButton>

      <SectionTitle>Connection & reliability</SectionTitle>
      <Card className="space-y-4">
        <Row
          detail="See saved information and queued work"
          icon={icons.cloudOff}
          title="Offline view"
          onClick={() => go("offline")}
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Loading state for laboratory records"
          icon={icons.loader}
          title="Reports are loading"
          onClick={() => go("labsLoading")}
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Review a preserved local upload draft"
          icon={icons.cloudOff}
          title="Interrupted upload"
          onClick={() => go("uploadFailed")}
        />
      </Card>
    </div>
  )
}
