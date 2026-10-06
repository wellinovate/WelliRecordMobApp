import React from "react"
import { Badge, Card, Icon, Row, SectionTitle } from "../components/common"
import { icons } from "../constants/icons"
import { CareStage, Screen } from "../types/navigation"

export function HomeScreen({
  go,
  careStage,
}: {
  go: (screen: Screen) => void
  careStage: CareStage
}) {
  return (
    <div className="stack">
      <Card className="welliid-card border-[#031f50] bg-[#031f50] p-5 text-white shadow-xl">
        <div className="flex items-center justify-between text-[11px] font-medium tracking-[0.08em] text-[#e0e9f8]">
          <span>YOUR WELLIID</span>
          <Icon size={28} src={icons.fingerprint} />
        </div>
        <p className="mt-5 text-[27px] font-semibold tracking-[0.02em]">
          WR-4821-0936
        </p>
        <p className="mt-3 text-xs leading-[1.45] text-[#e0e9f8]">
          One patient. One trusted record.
          <br />
          Accessible when it matters.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
            Synced today, 08:42
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
            Available offline
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-4 gap-2">
        {[
          [icons.calendar, "Appointments", "bookingTime"],
          [icons.send, "Share record", "consentExpanded"],
          [icons.scan, "Upload", "records"],
          [icons.lab, "Lab results", "reports"],
        ].map(([icon, label, target]) => (
          <button
            className="flex flex-col items-center gap-2 text-center transition-transform active:scale-95"
            key={label}
            onClick={() => go(target as Screen)}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#edf2fa]">
              <Icon size={23} src={icon} />
            </span>
            <span className="text-[10px] font-semibold leading-tight text-[#031f50]">
              {label}
            </span>
          </button>
        ))}
      </div>

      <Card onClick={() => go("careDiscovery")}>
        <Row
          detail="Participating providers, appointments, labs and pharmacies"
          icon={icons.stethoscope}
          title="Find care near you"
        />
      </Card>

      <SectionTitle>Your health at a glance</SectionTitle>
      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-[#031f50]">O+</p>
            <p className="text-xs text-[#53657c]">Blood group</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#031f50]">AA</p>
            <p className="text-xs text-[#53657c]">Genotype</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="red">Penicillin allergy</Badge>
          <Badge>Hypertension</Badge>
        </div>
        <p className="mt-3 text-xs text-[#53657c]">
          Alert: penicillin caused a rash · Provider confirmed
        </p>
      </Card>

      <SectionTitle action="View timeline" onAction={() => go("timeline")}>
        Next in your care
      </SectionTitle>
      <Card className="space-y-4">
        <Row
          detail={
            careStage === "checkedIn"
              ? "Checked in · Waiting for triage at Lagoon Hospital"
              : "Mon, 5 Oct · 10:30 AM · Lagoon Hospital, Ikeja"
          }
          icon={icons.calendar}
          title={
            careStage === "checkedIn"
              ? "Visit with Dr Amaka Bello"
              : careStage === "booked"
                ? "Booked · Follow-up with Dr Amaka Bello"
                : "Follow-up with Dr Amaka Bello"
          }
          onClick={() =>
            go(
              careStage === "checkedIn"
                ? "careJourney"
                : careStage === "booked"
                  ? "bookingConfirmed"
                  : "bookingTime",
            )
          }
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Next dose today at 8:00 PM · After food"
          icon={icons.pill}
          title="Ferrous sulfate · 200 mg"
          onClick={() => go("medications")}
        />
      </Card>

      <SectionTitle action="View all" onAction={() => go("reports")}>
        Recent record activity
      </SectionTitle>
      <Card onClick={() => go("reports")}>
        <Row
          detail="SYNLAB Ikeja · 29 Sep 2026"
          icon={icons.lab}
          title="Full blood count added"
        />
        <div className="mt-3 flex items-center justify-between gap-2">
          <Badge>Verified provider</Badge>
          <span className="text-[11px] text-[#53657c]">
            Shared with Dr Bello · 24 hours
          </span>
        </div>
      </Card>
    </div>
  )
}
