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

export function LostPhoneScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="End device access without deleting your health record."
        eyebrow="SECURITY · SEQUENTIAL CONFIRMATION STATES"
        title="Protect a lost phone"
      />
      <Badge tone="amber">Before confirmation · Review</Badge>
      <Card>
        <p className="text-sm font-semibold text-[#031f50]">
          Log out all devices / freeze sessions
        </p>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          All current sessions will end, including this one. Every device must
          sign in and verify again before accessing your account.
        </p>
        <div className="mt-4">
          <Row
            detail="iPhone 14 · Chrome on Windows · Recovery device"
            icon={icons.smartphone}
            title="Devices in this request"
          />
        </div>
      </Card>
      <Guidance title="Authentication and connection required" tone="amber">
        Confirm your identity first. Sessions end only when the server confirms
        online. This is not a remote wipe of the lost phone.
      </Guidance>
      <PrimaryButton danger onClick={() => go("verifyRecovery")}>
        Authenticate & confirm logout of all devices
      </PrimaryButton>
      <SecondaryButton onClick={() => go("profile")}>
        Cancel · Keep sessions
      </SecondaryButton>
      <p className="text-xs leading-[1.45] text-[#53657c]">
        Server-held records and WelliID remain. Clinical consent is unchanged.
      </p>
      <div className="h-px bg-[#dae2ee]" />
      <Card className="border-[#edf2fa] bg-[#edf2fa]">
        <p className="text-[10px] font-semibold text-[#173b71]">
          AFTER CONFIRMATION · SEPARATE LATER STATE
        </p>
        <h3 className="mt-3 text-lg font-bold text-[#031f50]">
          ✓ Sessions ended
        </h3>
        <p className="mt-3 text-xs leading-[1.45] text-[#173b71]">
          Authenticated request confirmed online · 3 Oct 2026, 10:30 AM ·
          Africa/Lagos. All prior sessions ended.
        </p>
        <div className="mt-4">
          <PrimaryButton onClick={() => go("recoverAccount")}>
            Sign in again on a safe device
          </PrimaryButton>
        </div>
      </Card>
      <SecondaryButton onClick={() => alert("Connecting to 24/7 WelliRecord Patient Support...")}>
        Contact recovery support
      </SecondaryButton>
    </div>
  )
}

export function RecoverAccountScreen({ go }: { go: (screen: Screen) => void }) {
  const [useEmail, setUseEmail] = useState(false)
  const [contact, setContact] = useState("+234 803 555 0142")

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Use a contact or passkey you previously verified."
        eyebrow="RECOVERY · BEFORE AUTHENTICATION"
        title="Recover your account"
      />
      <label>
        <span className="text-sm font-semibold text-[#031f50]">
          Phone number or email
        </span>
        <input
          className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm outline-none focus:border-[#24518c]"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <span className="mt-2 block text-xs text-[#53657c]">
          Verified contact for Adaeze Okafor.
        </span>
      </label>
      <Card className="space-y-4">
        <Choice
          selected={!useEmail}
          detail="Send a private verification code via SMS"
          onClick={() => setUseEmail(false)}
          title="Recover with verified phone"
          icon={icons.smartphone}
        />
        <Choice
          selected={useEmail}
          detail="Use an email you added to this account"
          onClick={() => setUseEmail(true)}
          title="Use verified email instead"
          icon={icons.link}
        />
        <p className="text-xs leading-[1.45] text-[#53657c]">
          If an account matches, instructions will be sent. This does not reveal
          whether an entered account exists.
        </p>
      </Card>
      <PrimaryButton onClick={() => go("verifyRecovery")}>
        Request recovery instructions
      </PrimaryButton>
      <SecondaryButton onClick={() => go("recovered")}>
        Recover with an existing passkey
      </SecondaryButton>
      <Guidance title="Your health identity is not lost">
        Your WelliID and server-held records remain even if your phone is lost.
        Recovery protects access; it does not delete medical records.
      </Guidance>
      <Card>
        <Row
          detail="Secure sessions after identity verification."
          icon={icons.smartphone}
          title="Lost your phone?"
          onClick={() => go("lostPhone")}
        />
      </Card>
    </div>
  )
}

export function VerifyRecoveryScreen({ go }: { go: (screen: Screen) => void }) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const complete = code.every(Boolean)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="You are recovering access on another device."
        eyebrow="RECOVERY · PROTECTED VERIFICATION"
        title="Verify it’s you"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.shieldRecovery} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold leading-[1.3] text-[#031f50]">
          Check your verified contact
        </h3>
        <p className="mt-3 text-sm text-[#53657c]">
          SMS destination · +234 803 ••• 0142
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#031f50]">6-digit recovery code</p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {code.map((digit, index) => (
            <input
              aria-label={`Recovery digit ${index + 1}`}
              className="h-14 min-w-0 rounded-xl border border-[#cbd7e8] bg-white text-center text-xl font-bold text-[#031f50] outline-none focus:border-[#031f50]"
              inputMode="numeric"
              key={index}
              maxLength={1}
              onChange={(event) => {
                const next = [...code]
                next[index] = event.target.value.replace(/\D/g, "")
                setCode(next)
                if (event.target.value && event.target.nextElementSibling) {
                  ;(event.target.nextElementSibling as HTMLInputElement).focus()
                }
              }}
              value={digit}
            />
          ))}
        </div>
        <p className="mt-3 text-sm leading-[1.45] text-[#53657c]">
          Code expires 10 minutes after sending. A new code invalidates the old
          one. Never reuse a sign-in or recovery code.
        </p>
      </div>
      <PrimaryButton
        disabled={!complete}
        onClick={() => go("recovered")}
      >
        Verify & continue
      </PrimaryButton>
      <SecondaryButton onClick={() => setCode(["1", "2", "3", "4", "5", "6"])}>
        Resend recovery code (Fill Demo)
      </SecondaryButton>
      <Guidance title="Recovery is protected">
        Verification is needed before changing security settings. No medical
        record is shared during recovery.
      </Guidance>
      <Card>
        <p className="text-sm font-semibold text-[#031f50]">Can’t access this contact?</p>
        <p className="mt-2 text-xs leading-[1.45] text-[#53657c]">
          Try an existing passkey or verified email. If neither works, contact
          recovery support for identity checks.
        </p>
      </Card>
    </div>
  )
}

export function RecoveredScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Recovery verified. Your new passkey is configured."
        eyebrow="RECOVERY OUTCOME · AFTER VERIFIED RECOVERY"
        title="Your account is secured"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.key} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">
          Access recovered safely
        </h3>
        <p className="mt-3 text-sm text-[#53657c]">
          Adaeze Okafor · WR-4821-0936
        </p>
      </div>
      <Card>
        <Badge>New passkey configured</Badge>
        <div className="mt-4">
          <Row
            detail="Added after verified recovery · 3 Oct 2026"
            icon={icons.key}
            title="Passkey on this device"
          />
        </div>
        <p className="mt-3 text-xs text-[#53657c]">
          Use device screen lock or biometrics. Review your backup verified
          contact too.
        </p>
      </Card>
      <Guidance title="Your identity and records remain intact">
        Your WelliID and server-held records are unchanged. Recovery does not
        delete medical data or revoke clinical consent.
      </Guidance>
      <Card>
        <Row
          detail="Check iPhone 14 and Chrome on Windows."
          icon={icons.monitor}
          title="Review prior sessions"
          onClick={() => go("lostPhone")}
        />
      </Card>
      <PrimaryButton onClick={() => go("lostPhone")}>
        Review devices & sessions
      </PrimaryButton>
      <SecondaryButton onClick={() => go("lostPhone")}>
        Lost-phone protection
      </SecondaryButton>
      <SecondaryButton onClick={() => go("profile")}>
        Return to my account
      </SecondaryButton>
    </div>
  )
}
