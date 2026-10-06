import React from "react"
import {
  Badge,
  Card,
  Guidance,
  PrimaryButton,
  Row,
  SecondaryButton,
  SectionTitle,
} from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export function ProfileScreen({
  go,
  onSignOut,
}: {
  go: (screen: Screen) => void
  onSignOut: () => void
}) {
  return (
    <div className="stack">
      <Card>
        <p className="text-[11px] font-semibold text-[#53657c]">MY ACCOUNT</p>
        <h2 className="mt-3 text-xl font-bold text-[#031f50]">Adaeze Okafor</h2>
        <p className="mt-2 text-sm font-semibold text-[#24518c]">WR-4821-0936</p>
        <p className="mt-3 text-xs leading-[1.5] text-[#53657c]">
          Female · 34 years · 14 Jun 1992
          <br />
          Lagos, Nigeria
        </p>
      </Card>

      <SectionTitle>Coverage & records</SectionTitle>
      <Card className="space-y-4">
        <Row
          detail="Member RL-209184 · Valid to 31 Dec 2026"
          icon={icons.shield}
          title="Reliance HMO · Active"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="4 participating providers · Last synced 08:42"
          icon={icons.link}
          title="24 linked health records"
          onClick={() => go("records")}
        />
        <div>
          <Badge>Consent controlled · 2 active grants</Badge>
        </div>
      </Card>

      <Guidance title="Your WelliID is not a national ID">
        NIN linkage is optional and not yet linked. We only request it where
        appropriate.
      </Guidance>

      <SectionTitle action="Review" onAction={() => go("emergencyQr")}>
        Emergency basics
      </SectionTitle>
      <Card>
        <p className="text-sm font-semibold text-[#031f50]">
          Penicillin allergy · Hypertension
        </p>
        <p className="mt-3 text-xs text-[#53657c]">
          Contact: Chidi Okafor · Husband
          <br />
          +234 803 555 0142
        </p>
        <button
          className="mt-4 text-xs font-semibold text-[#24518c] hover:underline"
          onClick={() => go("emergencyQr")}
        >
          Review emergency access →
        </button>
      </Card>

      <Card className="space-y-4">
        <Row
          detail="Separate identities. Limited access, with expiry."
          icon={icons.people}
          title="Family & caregivers"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Protect your identity and manage permissions"
          icon={icons.lock}
          title="Security & privacy"
          onClick={() => go("lostPhone")}
        />
      </Card>

      <SectionTitle>Account & accessibility</SectionTitle>
      <Card className="space-y-4">
        <Row
          detail="Language, larger text and reading support"
          icon={icons.book}
          title="Language & accessibility"
          onClick={() => go("preferences")}
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Recover access or review trusted sessions"
          icon={icons.key}
          title="Account recovery"
          onClick={() => go("recoverAccount")}
        />
      </Card>

      <PrimaryButton onClick={() => go("consentExpanded")}>
        Open Consent Center
      </PrimaryButton>
      <SecondaryButton onClick={onSignOut}>Sign out</SecondaryButton>
    </div>
  )
}
