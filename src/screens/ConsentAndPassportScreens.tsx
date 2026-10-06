import React, { useState } from "react"
import {
  Badge,
  Card,
  Choice,
  Guidance,
  Icon,
  PrimaryButton,
  Row,
  SecondaryButton,
  SectionTitle,
} from "../components/common"
import { icons } from "../constants/icons"
import { PendingConsent, Screen } from "../types/navigation"

export function ConsentExpandedScreen({
  go,
  activeConsent,
  pendingConsent,
  onApprove,
  onReject,
}: {
  go: (screen: Screen) => void
  activeConsent: boolean
  pendingConsent: PendingConsent
  onApprove: () => void
  onReject: () => void
}) {
  return (
    <div className="stack">
      <div className="flex flex-wrap gap-2">
        <Badge>{activeConsent ? "2 active" : "1 active"}</Badge>
        {pendingConsent === "pending" && (
          <Badge tone="amber">1 pending</Badge>
        )}
        <Badge>{activeConsent ? "3 expired" : "4 expired"}</Badge>
      </div>

      <SectionTitle>Active permissions</SectionTitle>
      {activeConsent ? (
        <Card>
          <Row
            detail="Lagoon Hospital · Verified provider"
            icon={icons.recordStethoscope}
            title="Dr Amaka Bello"
          />
          <div className="mt-4">
            <Badge>Active</Badge>
          </div>
          <p className="mt-4 text-sm leading-[1.45] text-[#173b71]">
            Laboratory, medications & prescriptions, medical consultations ·
            Treatment follow-up
          </p>
          <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
            Consent C-1031 · Granted 3 Oct, 9:41 AM
            <br />
            Expires 4 Oct 2026, 9:41 AM · 24 hours
          </p>
          <button
            className="mt-4 text-xs font-semibold text-[#af4540] hover:underline"
            onClick={() => go("revoke")}
          >
            Revoke access now
          </button>
        </Card>
      ) : (
        <Guidance title="Dr Amaka Bello access revoked">
          Future access under C-1031 has ended. The revocation is saved in
          Record Activity.
        </Guidance>
      )}

      <Card>
        <Row
          detail="Caregiver · Separate WelliID WR-7204-1683"
          icon={icons.people}
          title="Chidi Okafor · Husband"
        />
        <div className="mt-4">
          <Badge>Limited</Badge>
        </div>
        <p className="mt-4 text-sm text-[#173b71]">
          Medications & appointments only · Family support
        </p>
        <p className="mt-3 text-xs text-[#53657c]">
          Consent C-1024 · Expires 31 Oct 2026, 11:59 PM
        </p>
        <button
          onClick={() => alert("Caregiver permissions: Medications & Visit scheduling")}
          className="mt-4 text-xs font-semibold text-[#24518c] hover:underline"
        >
          Manage or revoke caregiver access
        </button>
      </Card>

      {pendingConsent === "pending" ? (
        <>
          <SectionTitle>Pending your decision</SectionTitle>
          <Card className="bg-[#fbf2e3] border-[#f6d8a7]">
            <Row
              detail="Requested 3 Oct, 9:10 AM · Verified laboratory"
              icon={icons.recordLab}
              title="SYNLAB Ikeja"
            />
            <div className="mt-4">
              <Badge tone="amber">Pending</Badge>
            </div>
            <p className="mt-4 text-sm leading-[1.45] text-[#173b71]">
              Laboratory category only · Compare previous results for a repeat
              test · Requested duration: 30 days
            </p>
            <p className="mt-3 text-xs text-[#53657c]">
              No access until you approve.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <PrimaryButton onClick={onApprove}>Approve</PrimaryButton>
              <SecondaryButton onClick={onReject}>Reject</SecondaryButton>
            </div>
          </Card>
        </>
      ) : (
        <Guidance
          title={
            pendingConsent === "approved"
              ? "SYNLAB request approved"
              : "SYNLAB request rejected"
          }
        >
          {pendingConsent === "approved"
            ? "Laboratory-only access is active for 30 days and has been added to Record Activity."
            : "No access was granted. Your decision has been added to Record Activity."}
        </Guidance>
      )}

      <SectionTitle action="All 3 →" onAction={() => go("recordActivity")}>
        Recently expired
      </SectionTitle>
      <Card>
        <Row
          detail="Prescription only · One-time access used 30 Sep · C-1026"
          icon={icons.pill}
          title="HealthPlus, Ikeja"
        />
        <div className="mt-3">
          <Badge>Expired</Badge>
        </div>
      </Card>

      <Guidance title="Revocation ends future access">
        It cannot undo a past view or erase records a provider must legally
        retain.
      </Guidance>

      <PrimaryButton onClick={() => go("recordActivity")}>
        Consent history & record activity
      </PrimaryButton>
      <SecondaryButton onClick={() => go("recordActivity")}>
        Review access history
      </SecondaryButton>
    </div>
  )
}

const activityItems = [
  [
    "You shared with Dr Amaka Bello",
    "3 Oct 2026 · 9:41 AM",
    "Laboratory, medicines & consultations",
    "Purpose: treatment follow-up · 24 hours",
    "C-1031 · Ends 4 Oct, 9:41 AM",
    "share",
  ],
  [
    "Chidi Okafor viewed your record",
    "2 Oct 2026 · 8:10 PM",
    "Current medication list",
    "Purpose: family support",
    "C-1024 · Caregiver grant to 31 Oct",
    "view",
  ],
  [
    "You revoked CityCare Clinic",
    "30 Sep 2026 · 4:20 PM",
    "Laboratory access ended immediately",
    "Reason: no longer needed · Added by you",
    "C-1018 · Revoked by patient",
    "revoke",
  ],
  [
    "HealthPlus viewed a prescription",
    "30 Sep 2026 · 11:05 AM",
    "Ferrous sulfate prescription · 28 Sep",
    "Purpose: dispensing · One-time access",
    "C-1026 · Used, now expired",
    "medicine",
  ],
  [
    "SYNLAB added your laboratory report",
    "29 Sep 2026 · 1:42 PM",
    "Full blood count · SL-290926-184",
    "Purpose: delivering your ordered test result",
    "C-1025 · Provider deposit permission",
    "add",
  ],
] as const

export function RecordActivityScreen({
  activeConsent,
  pendingConsent,
}: {
  activeConsent: boolean
  pendingConsent: PendingConsent
}) {
  const [filter, setFilter] = useState("All activity")
  const activityIcon: Record<string, string> = {
    share: icons.send,
    view: icons.activityEye,
    revoke: icons.activityShieldX,
    medicine: icons.pill,
    add: icons.files,
  }

  return (
    <div className="stack">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All activity", "Last 30 days", "Filters"].map((item) => (
          <button
            className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold transition-all ${
              filter === item
                ? "border-[#031f50] bg-[#031f50] text-white"
                : "border-[#dae2ee] bg-white text-[#031f50]"
            }`}
            key={item}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <Guidance title="An access history you can understand">
        Each entry links the recipient, selected scope, purpose, duration and
        consent. Provider additions keep their original source.
      </Guidance>
      {!activeConsent && (
        <Card>
          <Row
            detail="Today · Confirmed by you"
            icon={icons.activityShieldX}
            title="You revoked Dr Amaka Bello"
          />
          <p className="mt-4 text-sm font-semibold text-[#173b71]">
            Future access under C-1031 ended
          </p>
          <div className="mt-3">
            <Badge tone="red">Revoked</Badge>
          </div>
        </Card>
      )}
      {pendingConsent !== "pending" && (
        <Card>
          <Row
            detail="Today · Consent request C-1032"
            icon={icons.recordLab}
            title={`You ${pendingConsent} SYNLAB Ikeja’s request`}
          />
          <p className="mt-4 text-xs text-[#53657c]">
            {pendingConsent === "approved"
              ? "Laboratory-only access granted for 30 days."
              : "No record access was granted."}
          </p>
        </Card>
      )}
      {activityItems.map(([title, date, scope, purpose, consent, icon]) => (
        <Card key={title}>
          <Row detail={date} icon={activityIcon[icon]} title={title} />
          <p className="mt-4 text-sm font-semibold text-[#173b71]">{scope}</p>
          <p className="mt-2 text-xs text-[#53657c]">{purpose}</p>
          <div className="mt-3">
            <Badge>{consent}</Badge>
          </div>
        </Card>
      ))}
      <PrimaryButton onClick={() => alert("Downloading tamper-proof NDPR Audit Log (PDF)...")}>
        Download my access history
      </PrimaryButton>
      <p className="text-center text-xs text-[#53657c]">
        Questions about an access? Flag the entry for review.
      </p>
    </div>
  )
}

export function EmergencyQrScreen({
  active,
  onActivate,
}: {
  active: boolean
  onActivate: () => void
}) {
  return (
    <div className="stack">
      <Card className="text-center shadow-md">
        <img
          alt="Secure emergency QR code"
          className="mx-auto size-36 rounded-xl border border-[#dae2ee] p-2 bg-white"
          src={icons.emergencyQr}
        />
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          Adaeze Okafor · WR-4821-0936
        </p>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          Scanning opens a secure emergency interface, not your complete health
          record. Online authorization is required.
        </p>
      </Card>

      <div className="flex items-center justify-between">
        <SectionTitle>Your authorized emergency fields</SectionTitle>
        <button
          onClick={() => alert("Edit emergency medical profile")}
          className="text-xs font-semibold text-[#24518c] hover:underline"
        >
          Edit
        </button>
      </div>

      <Card className="space-y-4">
        {[
          ["Identity, blood group & genotype", "Adaeze Okafor · O+ · AA"],
          [
            "Allergy & important condition",
            "Penicillin: rash · Hypertension",
          ],
          ["Medication relevant to emergency care", "Amlodipine 5 mg daily"],
          [
            "Emergency contact",
            "Chidi Okafor · +234 803 555 0142",
          ],
        ].map(([title, detail]) => (
          <Choice
            selected
            detail={detail}
            key={title}
            title={title}
            icon={icons.shield}
          />
        ))}
        <p className="text-xs text-[#53657c]">
          Lab history, documents and full record are excluded.
        </p>
      </Card>

      <Guidance title="Authorized emergency personnel only">
        Each access is limited to 10 minutes and logged with the viewer, time
        and emergency purpose.
      </Guidance>
      <Guidance title="Offline copy · Last synced today, 08:42">
        Essentials are stored on this device. This copy may miss changes since
        sync. QR authorization needs connectivity.
      </Guidance>
      <Guidance title="Before you activate emergency mode" tone="amber">
        We will notify Chidi and share only the selected essentials with him for
        10 minutes. Your location stays off unless you opt in.
      </Guidance>

      {active && (
        <Guidance title="Emergency sharing is active">
          Your selected essentials are currently shared. Open the emergency
          screen to review or end access.
        </Guidance>
      )}

      <PrimaryButton danger onClick={onActivate}>
        {active ? "View active emergency" : "I’m in an emergency"}
      </PrimaryButton>
      <SecondaryButton onClick={() => alert("Emergency QR card saved to wallet/photos!")}>
        Save emergency QR card
      </SecondaryButton>
    </div>
  )
}

export function EmergencyInfoScreen({ onEnd }: { onEnd: () => void }) {
  return (
    <div className="stack">
      <div className="rounded-[20px] bg-[#af4540] p-5 text-white shadow-lg">
        <p className="text-[10px] font-semibold tracking-wider uppercase">EMERGENCY INFORMATION</p>
        <h2 className="mt-2 text-xl font-bold">“I’m in an emergency” is active</h2>
        <p className="mt-2 text-xs text-[#faedea]">
          Started 3 Oct at 9:40 AM · Essentials only
          <br />
          Emergency sharing ends at 9:50 AM.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <p className="text-xs text-[#53657c]">Blood group</p>
          <p className="mt-2 text-2xl font-bold text-[#031f50]">O+</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs text-[#53657c]">Genotype</p>
          <p className="mt-2 text-2xl font-bold text-[#031f50]">AA</p>
        </Card>
      </div>

      <Card className="border-[#faedea] bg-[#faedea]">
        <p className="text-[10px] font-semibold text-[#af4540]">ALLERGY ALERT</p>
        <h3 className="mt-2 text-lg font-bold text-[#af4540]">Penicillin</h3>
        <p className="mt-2 text-xs text-[#936020]">
          Recorded reaction: rash · Provider confirmed
        </p>
      </Card>

      <Card>
        <p className="text-[10px] font-semibold text-[#53657c]">IMPORTANT CONDITION & MEDICATION</p>
        <h3 className="mt-3 text-sm font-semibold text-[#031f50]">Hypertension</h3>
        <p className="mt-2 text-sm text-[#173b71]">Amlodipine 5 mg · Once daily</p>
        <p className="mt-2 text-xs text-[#53657c]">
          Source: Lagoon Hospital · Dr Bello · 28 Sep 2026
        </p>
      </Card>

      <Card>
        <Row
          detail="+234 803 555 0142 · Tap to call"
          icon={icons.emergencyPhone}
          title="Chidi Okafor · Husband"
          onClick={() => alert("Calling Chidi Okafor (+234 803 555 0142)...")}
        />
        <div className="mt-3">
          <Badge>Selected contact notified · 9:40 AM</Badge>
        </div>
        <p className="mt-3 text-xs text-[#53657c]">
          Shared with Chidi: identity, O+/AA, allergy, hypertension and
          amlodipine. Grant E-1032 · 10 minutes · Logged.
        </p>
      </Card>

      <Guidance title="Location sharing is off">
        Your location was not sent. Share only if you choose.
      </Guidance>

      <Guidance title="This does not dispatch emergency services" tone="amber">
        Contact notification does not guarantee a response. Seek local
        emergency help directly.
      </Guidance>

      <PrimaryButton danger onClick={onEnd}>
        End emergency sharing
      </PrimaryButton>
    </div>
  )
}

export function HealthPassportScreen() {
  const [items, setItems] = useState([true, true, true, true, true, true])
  const checklist = [
    ["Selected medical history", "Hypertension · 28 Sep consultation summary"],
    ["Allergies", "Penicillin · Recorded reaction: rash"],
    ["Current medicines", "Amlodipine 5 mg · Ferrous sulfate 200 mg"],
    ["Selected vaccinations", "Td booster · 18 Jun 2026 · Lagoon Hospital"],
    ["Emergency basics & contact", "O+ · AA · Chidi Okafor · +234 803 555 0142"],
    ["Selected document", "Td vaccination certificate · 1 PDF"],
  ]

  return (
    <div className="stack">
      <Card className="border-[#031f50] bg-[#031f50] text-white shadow-md">
        <div className="flex items-center gap-2">
          <Icon size={20} src={icons.passportGlobe} />
          <p className="text-sm font-semibold">Adaeze Okafor</p>
        </div>
        <p className="mt-3 text-xs text-[#e0e9f8]">
          WR-4821-0936 · Patient-reviewed summary
          <br />
          Reviewed by you · 3 Oct 2026, 9:30 AM
        </p>
      </Card>

      <SectionTitle>Choose what travels with you</SectionTitle>
      <Card className="space-y-4">
        {checklist.map(([title, detail], idx) => (
          <Choice
            selected={items[idx]}
            detail={detail}
            key={title}
            title={title}
            onClick={() => {
              const next = [...items]
              next[idx] = !next[idx]
              setItems(next)
            }}
            icon={icons.designCheck}
          />
        ))}
        <Choice
          selected={false}
          detail="Excluded from this passport"
          title="All lab reports & imaging"
          icon={icons.imaging}
        />
      </Card>

      <SectionTitle>Recipient & duration</SectionTitle>
      <Card className="space-y-4">
        <label className="text-xs text-[#53657c]">
          Selected recipient
          <select className="mt-2 h-12 w-full rounded-lg border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50] outline-none">
            <option>Dr Nina Patel · Travel clinic, London</option>
            <option>Dr K. Mensah · Accra Medical Centre</option>
          </select>
        </label>
        <label className="block text-xs text-[#53657c]">
          Purpose
          <input
            className="mt-2 h-12 w-full rounded-lg border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50] outline-none"
            defaultValue="Travel health consultation"
          />
        </label>
        <label className="block text-xs text-[#53657c]">
          Secure access duration
          <select className="mt-2 h-12 w-full rounded-lg border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50] outline-none">
            <option>7 days · Ends 10 Oct 2026, 9:41 AM</option>
            <option>24 hours · Ends 4 Oct 2026, 9:41 AM</option>
            <option>30 days · Ends 2 Nov 2026, 9:41 AM</option>
          </select>
        </label>
      </Card>

      <Guidance title="Portable, not unrestricted" tone="amber">
        Only your selected summary is included. A secure link can expire or be
        revoked; a downloaded PDF cannot be recalled.
      </Guidance>

      <PrimaryButton onClick={() => alert("Generating encrypted Health Passport PDF...")}>
        Preview & export selected PDF
      </PrimaryButton>
      <SecondaryButton onClick={() => alert("Exporting FHIR standard format...")}>
        Structured exchange · Where supported
      </SecondaryButton>
      <p className="text-xs leading-[1.45] text-[#53657c]">
        You can take your data with you without paying for access. Original
        records are preserved.
      </p>
    </div>
  )
}
