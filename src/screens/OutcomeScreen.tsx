import React from "react"
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  SecondaryButton,
} from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export function OutcomeScreen({
  kind,
  go,
  onConfirmRevoke,
}: {
  kind: "revoke" | "shared"
  go: (screen: Screen) => void
  onConfirmRevoke?: () => void
}) {
  const revoke = kind === "revoke"

  return (
    <div className="stack">
      <div
        className={`flex flex-col items-center rounded-[20px] p-[22px] text-center ${
          revoke ? "bg-[#faedea]" : "bg-[#edf2fa]"
        }`}
      >
        <span
          className={`flex size-[60px] items-center justify-center rounded-full ${
            revoke ? "bg-[#af4540]" : "bg-[#031f50]"
          }`}
        >
          <Icon size={28} src={revoke ? icons.revoke : icons.success} />
        </span>
        <h2 className="mt-3 text-[22px] font-bold leading-[1.3] text-[#031f50]">
          {revoke ? "End future access" : "Shared for 24 hours"}
        </h2>
        <p className="mt-3 text-sm leading-[1.45] text-[#53657c]">
          {revoke
            ? "This choice applies to consent C-1031 only."
            : "You continued with your selected duration. Access has not been extended."}
        </p>
      </div>

      <Card>
        <Badge>Active · Consent C-1031</Badge>
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          {revoke
            ? "Dr Amaka Bello · Verified provider"
            : "Treatment · Follow-up review"}
        </p>
        <p className="mt-3 text-sm leading-[1.45] text-[#173b71]">
          Laboratory
          <br />
          Medications & prescriptions
          <br />
          Medical consultations only
        </p>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          Granted 3 Oct 2026, 9:41 AM
          <br />
          Expires 4 Oct 2026, 9:41 AM · Africa/Lagos
        </p>
      </Card>

      <Guidance
        title={
          revoke
            ? "What revocation means"
            : "This does not cover your 5 Oct visit"
        }
        tone="amber"
      >
        {revoke
          ? "After online confirmation, future eligible access ends immediately. Past views cannot be undone."
          : "Your 10:30 AM appointment is after expiry. Change the duration only if you choose to."}
      </Guidance>

      {revoke ? (
        <PrimaryButton danger onClick={onConfirmRevoke}>
          Confirm revoke
        </PrimaryButton>
      ) : (
        <PrimaryButton onClick={() => go("consentExpanded")}>
          Manage duration
        </PrimaryButton>
      )}

      <SecondaryButton onClick={() => go("consentExpanded")}>
        {revoke ? "Cancel · Keep access" : "View consent"}
      </SecondaryButton>

      <p className="text-center text-xs text-[#53657c]">
        {revoke
          ? "Restoring access will require a new consent choice."
          : "All accesses are logged. You can revoke eligible access in Consent Center."}
      </p>
    </div>
  )
}
