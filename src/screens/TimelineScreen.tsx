import React, { useState } from "react"
import { Badge, Card, Guidance, Icon } from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export const timelineItems = [
  [
    "30 Sep 2026",
    icons.pill,
    "Prescription dispensed",
    "HealthPlus, Ikeja · Pharmacist T. Aina",
    "Ferrous sulfate 200 mg · 30 tablets",
  ],
  [
    "29 Sep 2026",
    icons.lab,
    "Full blood count",
    "SYNLAB Ikeja · Report SL-290926-184",
    "Haemoglobin 10.2 g/dL · Lab reference: 12.0–15.5 g/dL",
  ],
  [
    "28 Sep 2026",
    icons.fileHeart,
    "Prescription issued",
    "Dr Amaka Bello · Lagoon Hospital",
    "Ferrous sulfate 200 mg once daily · Amlodipine 5 mg continued",
  ],
  [
    "28 Sep 2026",
    icons.stethoscope,
    "Follow-up consultation",
    "Dr Amaka Bello · Lagoon Hospital",
    "Hypertension review · Full blood count requested",
  ],
  [
    "18 Jun 2026",
    icons.syringe,
    "Tetanus booster",
    "Lagoon Hospital · Nurse E. Adeyemi",
    "Td vaccine · Dose recorded",
  ],
] as const

export function TimelineScreen({ go }: { go: (screen: Screen) => void }) {
  const [activeFilter, setActiveFilter] = useState("All records")

  return (
    <div className="stack">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All records", "2026", "Filters"].map((item) => (
          <button
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
              activeFilter === item
                ? "border-[#031f50] bg-[#031f50] text-white"
                : "border-[#dae2ee] bg-white text-[#031f50]"
            }`}
            key={item}
            onClick={() => setActiveFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="text-xs leading-[1.45] text-[#53657c]">
        Filter by provider, doctor, lab, pharmacy, medicine, diagnosis, date or
        record type.
      </p>
      <div className="space-y-3">
        {timelineItems.map(([date, icon, title, source, detail], index) => (
          <div
            className="grid grid-cols-[30px_1fr] gap-2"
            key={`${date}-${title}`}
          >
            <div className="flex flex-col items-center">
              <span className="flex size-7 items-center justify-center rounded-full bg-[#edf2fa]">
                <Icon size={15} src={icon} />
              </span>
              {index < timelineItems.length - 1 && (
                <span className="mt-1 w-0.5 flex-1 bg-[#dae2ee]" />
              )}
            </div>
            <div>
              <p className="mb-2 text-[11px] font-semibold text-[#53657c]">
                {date}
              </p>
              <Card
                className="mb-1 p-4 transition-all hover:shadow-md"
                onClick={
                  title === "Full blood count" ? () => go("result") : undefined
                }
              >
                <p className="text-sm font-semibold text-[#031f50]">{title}</p>
                <p className="mt-2 text-xs text-[#53657c]">{source}</p>
                <p className="mt-3 text-xs leading-[1.45] text-[#173b71]">
                  {detail}
                </p>
                <div className="mt-3">
                  <Badge>Verified provider</Badge>
                </div>
              </Card>
            </div>
          </div>
        ))}
      </div>
      <Guidance title="Your own symptoms and measurements are Patient Added">
        They never silently rewrite this history.
      </Guidance>
    </div>
  )
}
