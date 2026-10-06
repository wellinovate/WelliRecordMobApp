import React from "react"
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  Row,
  SecondaryButton,
  SectionTitle,
} from "../components/common"
import { icons } from "../constants/icons"
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

export function EmptyVaultScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Adaeze Okafor · WR-4821-0936"
        eyebrow="NEW ACCOUNT · NO RECORDS LINKED"
        title="Your Health Vault"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.vault} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">
          Your first record starts here
        </h3>
        <p className="mt-3 text-sm leading-[1.45] text-[#53657c]">
          No health records yet. No diagnoses or record totals are assumed.
        </p>
      </div>
      <PrimaryButton onClick={() => go("records")}>Add a document</PrimaryButton>
      <SecondaryButton onClick={() => go("careDiscovery")}>
        Connect a participating provider
      </SecondaryButton>
      <Card>
        <Row
          detail="Ask your provider for a copy of your earlier reports."
          icon={icons.files}
          title="Request prior records"
        />
        <p className="mt-4 text-sm leading-[1.45] text-[#173b71]">
          A PDF or photo is enough to begin. Keep the original and check that
          the name, date and source are readable.
        </p>
      </Card>
      <Guidance title="Adding a record does not share it">
        You choose recipients, scope and duration separately in Share.
      </Guidance>
      <Guidance title="Know where a record came from">
        Look for Verified provider, Patient Added or Imported labels.
      </Guidance>
    </div>
  )
}

export function OfflineScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Some saved information is available on this device."
        eyebrow="RELIABILITY · CACHED VIEW · 3 OCT 2026"
        title="You’re offline"
      />
      <Guidance title="Last synced 3 Oct 2026, 08:42" tone="amber">
        Africa/Lagos · Saved information may be out of date. This view cannot
        confirm recent clinical changes or current access permissions.
      </Guidance>
      <Card>
        <Badge>Cached emergency basics</Badge>
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          Adaeze Okafor · WR-4821-0936
        </p>
        <p className="mt-3 text-sm leading-[1.5] text-[#173b71]">
          O+ blood · AA genotype
          <br />
          Penicillin allergy · Rash
          <br />
          Provider-confirmed source at last sync
        </p>
        <p className="mt-3 text-sm text-[#53657c]">
          Emergency contact: Chidi Okafor · Husband
          <br />
          +234 803 555 0142
        </p>
        <p className="mt-3 text-xs text-[#53657c]">
          Confirm current details with the patient or clinician; do not assume
          this is a live record.
        </p>
      </Card>
      <SectionTitle>Waiting for connection</SectionTitle>
      <Card>
        <Row
          detail="Full blood count.pdf · 284 KB"
          icon={icons.cloudUpload}
          title="1 queued upload"
        />
        <div className="mt-4">
          <Badge tone="amber">Consented queue · Not uploaded</Badge>
        </div>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          You chose to queue this file. It awaits connection; it is not added to
          your record.
        </p>
      </Card>
      <Guidance title="Low-data mode · On">
        Sync text first. Download PDFs on Wi-Fi. No sensitive health details
        sent by SMS.
      </Guidance>
      <Guidance title="Consent changes need you online">
        Granting or revoking access requires online confirmation.
      </Guidance>
      <PrimaryButton onClick={() => go("records")}>Check connection</PrimaryButton>
      <SecondaryButton onClick={() => go("profile")}>
        View saved emergency basics
      </SecondaryButton>
    </div>
  )
}

export function UploadFailedScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="A network problem interrupted the transfer."
        eyebrow="RELIABILITY · LOCAL DRAFT PRESERVED"
        title="Your upload didn’t finish"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#faedea] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#af4540]">
          <Icon size={28} src={icons.cloudOff} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">You can try again</h3>
        <p className="mt-3 text-sm text-[#53657c]">
          Your selected PDF is still saved as a local pending draft.
        </p>
      </div>
      <Card>
        <Row
          detail="284 KB · 2 pages · Selected on this device"
          icon={icons.fileText}
          title="Full blood count.pdf"
        />
        <div className="mt-4">
          <Badge tone="red">Upload failed · Network error</Badge>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf2fa]">
          <div className="h-full w-[42%] bg-[#af4540]" />
        </div>
        <p className="mt-3 text-xs text-[#53657c]">
          Transfer interrupted at 42%. Server receipt is not confirmed.
        </p>
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          Not added to your clinical record
        </p>
      </Card>
      <Guidance title="Nothing has been queued automatically" tone="amber">
        Retry sends this selected file now. Save for later keeps the draft on
        this device.
      </Guidance>
      <PrimaryButton onClick={() => go("records")}>Retry upload</PrimaryButton>
      <SecondaryButton onClick={() => go("offline")}>
        Save draft for later
      </SecondaryButton>
      <SecondaryButton onClick={() => go("records")}>
        Remove local draft
      </SecondaryButton>
    </div>
  )
}

export function LabsLoadingScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Adaeze Okafor · WR-4821-0936"
        eyebrow="RELIABILITY · LOADING, NOT EMPTY"
        title="Laboratory results"
      />
      <div className="flex items-center gap-4 rounded-[20px] bg-[#edf2fa] p-[22px]">
        <Icon size={32} src={icons.loader} />
        <div>
          <p className="text-sm font-semibold text-[#031f50]">Loading your reports…</p>
          <p className="mt-1 text-xs text-[#53657c]">
            Checking the latest available records.
          </p>
        </div>
      </div>
      <p className="text-xs text-[#53657c]">
        Report count will appear after loading.
      </p>
      {[1, 2, 3].map((item) => (
        <div
          className="rounded-[20px] border border-[#dae2ee] bg-white p-4 shadow-sm animate-pulse"
          key={item}
        >
          <div className="h-4 rounded-md bg-[#dfe7f3]" />
          <div className="mt-3 h-3 rounded-md bg-[#edf2fa]" />
          <div className="mt-4 h-10 rounded-lg bg-[#e7edf6]" />
          <div className="mt-3 h-4 w-3/5 rounded-md bg-[#edf2fa]" />
        </div>
      ))}
      <Guidance title="Your cached records are still safe">
        Loading does not delete your saved records. If the connection fails, you
        can return to the cached view.
      </Guidance>
      <SecondaryButton onClick={() => go("reports")}>
        Cancel loading & go back
      </SecondaryButton>
    </div>
  )
}
