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
import { Screen } from "../types/navigation"
import { authenticateWithBiometrics } from "../utils/biometrics"

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

export function WelcomeScreen({
  go,
  onCreateAccount,
}: {
  go: (screen: Screen) => void
  onCreateAccount: () => void
}) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="A safe place to start your health record."
        eyebrow="NEW ACCOUNT · BEFORE RECORD LINKING"
        title="Welcome"
      />
      <div className="rounded-[20px] bg-[#edf2fa] p-6 shadow-sm">
        <img alt="WelliRecord" className="size-[52px]" src={icons.logo} />
        <h3 className="mt-6 text-[31px] font-bold leading-[1.2] text-[#031f50]">
          Your health record.
          <br />
          Your identity.
          <br />
          Your control.
        </h3>
        <p className="mt-6 text-sm leading-[1.45] text-[#173b71]">
          Bring records together, understand their sources and choose who can
          see them.
        </p>
      </div>
      <Card className="space-y-4">
        <Row
          detail="Your WelliID stays with you, not your phone."
          icon={icons.fingerprint}
          title="One health identity"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Choose records, recipients and duration."
          icon={icons.shield}
          title="Permission, not assumptions"
        />
      </Card>
      <PrimaryButton onClick={onCreateAccount}>Create account</PrimaryButton>
      <SecondaryButton onClick={() => go("signIn")}>Sign in</SecondaryButton>
      <SecondaryButton onClick={() => go("preferences")}>
        Language & accessibility
      </SecondaryButton>
    </div>
  )
}

export function SignInScreen({
  go,
  onSignIn,
  onCreateAccount,
}: {
  go: (screen: Screen) => void
  onSignIn: () => void
  onCreateAccount: () => void
  onBiometricSignIn?: () => Promise<boolean>
}) {
  const [authenticating, setAuthenticating] = useState(false)

  const handlePasskey = async () => {
    setAuthenticating(true)
    const res = await authenticateWithBiometrics("Verify Face ID for Adaeze Okafor")
    setAuthenticating(false)
    if (res.success) {
      onSignIn()
    }
  }

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Use your passkey or verified contact to continue."
        eyebrow="RETURNING USER · SECURE ACCESS"
        title="Welcome back"
      />
      <Card>
        <p className="text-sm font-semibold text-[#031f50]">Adaeze Okafor</p>
        <p className="mt-2 text-xs text-[#53657c]">
          WR-4821-0936 · Last active today, 08:42
        </p>
      </Card>
      <PrimaryButton onClick={handlePasskey}>
        {authenticating ? "Verifying Face ID..." : "Continue with passkey / Face ID"}
      </PrimaryButton>
      <SecondaryButton onClick={onSignIn}>
        Send a code to my verified phone
      </SecondaryButton>
      <Guidance title="Your records stay protected">
        Signing in restores access to your existing WelliID and records. It
        does not create a new health record or change consent.
      </Guidance>
      <Card>
        <Row
          detail="Use a verified contact or complete identity checks"
          icon={icons.key}
          title="Can’t sign in?"
          onClick={() => go("recoverAccount")}
        />
      </Card>
      <div className="h-px bg-[#dae2ee]" />
      <p className="text-center text-xs text-[#53657c]">
        New to WelliRecord?
      </p>
      <SecondaryButton onClick={onCreateAccount}>
        Create an account
      </SecondaryButton>
    </div>
  )
}

export function CreateAccountScreen({ go }: { go: (screen: Screen) => void }) {
  const [email, setEmail] = useState(false)
  const [terms, setTerms] = useState(true)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Use a phone number or email you can access."
        eyebrow="NEW ACCOUNT · STEP 1 OF 4"
        title="Create your account"
      />
      <label>
        <span className="text-sm font-semibold text-[#031f50]">Full name</span>
        <input
          className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm outline-none focus:border-[#24518c]"
          defaultValue="Adaeze Okafor"
        />
        <span className="mt-2 block text-xs text-[#53657c]">
          Use the name you use with your healthcare provider.
        </span>
      </label>
      <Card className="space-y-4">
        <Choice
          selected={!email}
          detail="Selected contact method"
          onClick={() => setEmail(false)}
          title="Phone number"
          icon={icons.smartphone}
        />
        {!email && (
          <label className="block pl-[34px]">
            <span className="text-sm font-semibold text-[#031f50]">Nigeria (+234) · Phone</span>
            <input
              className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm outline-none focus:border-[#24518c]"
              defaultValue="0800 000 0000"
            />
            <span className="mt-2 block text-xs text-[#53657c]">
              Fictional demo number, not a real credential.
            </span>
          </label>
        )}
        <Choice
          selected={email}
          onClick={() => setEmail(true)}
          title="Use email instead"
          detail="Receive verification code via email"
          icon={icons.link}
        />
      </Card>
      <Choice
        selected={terms}
        detail="Required for account setup · Read privacy and terms →"
        onClick={() => setTerms(!terms)}
        title="I acknowledge the Privacy Notice and agree to the Terms"
        icon={icons.shield}
      />
      <Guidance title="Optional choices · Off">
        Research participation is off. Record sharing is not granted here. Any
        future request needs a separate scope, purpose and duration choice.
      </Guidance>
      <PrimaryButton
        disabled={!terms}
        onClick={terms ? () => go("verifyPhone") : undefined}
      >
        Continue to verify contact
      </PrimaryButton>
    </div>
  )
}

export function VerifyPhoneScreen({ go }: { go: (screen: Screen) => void }) {
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const complete = code.every(Boolean)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Enter the 6-digit code sent to your demo contact."
        eyebrow="NEW ACCOUNT · STEP 2 OF 4"
        title="Verify your phone"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.message} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">Check your messages</h3>
        <p className="mt-3 text-sm text-[#53657c]">
          Demo destination · +234 800 000 0000
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#031f50]">6-digit verification code</p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {code.map((digit, index) => (
            <input
              aria-label={`Verification digit ${index + 1}`}
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
          Code expires 10 minutes after it is sent. Resending replaces the
          previous code.
        </p>
      </div>
      <PrimaryButton
        disabled={!complete}
        onClick={() => go("onboardingId")}
      >
        Verify contact
      </PrimaryButton>
      <SecondaryButton onClick={() => setCode(["4", "8", "2", "1", "0", "9"])}>
        Resend code (Fill Demo)
      </SecondaryButton>
      <SecondaryButton onClick={() => go("createAccount")}>
        Change phone or use email
      </SecondaryButton>
      <Guidance title="Keep your code private">
        WelliRecord support will never ask you to read a verification code to
        them.
      </Guidance>
    </div>
  )
}

export function OnboardingIdScreen({ go }: { go: (screen: Screen) => void }) {
  const [informed, setInformed] = useState(true)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="New-account sample · No clinical records linked yet."
        eyebrow="NEW ACCOUNT · STEP 3 OF 4"
        title="Set up your WelliID"
      />
      <Card className="border-[#031f50] bg-[#031f50] text-white">
        <p className="text-[10px] text-[#e0e9f8]">
          YOUR NEW HEALTH IDENTIFIER
        </p>
        <p className="mt-4 text-[22px] font-semibold">WR-4821-0936</p>
        <p className="mt-3 text-[11px] text-[#e0e9f8]">
          Allocated in this sample flow · Adaeze Okafor
        </p>
      </Card>
      <label>
        <span className="text-sm font-semibold text-[#031f50]">Date of birth</span>
        <input
          className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm outline-none"
          defaultValue="14 Jun 1992"
        />
        <span className="mt-2 block text-xs text-[#53657c]">
          Female · Lagos · Verified account contact: +234 800 000 0000
        </span>
      </label>
      <div>
        <SectionTitle>Optional health basics</SectionTitle>
        <Card className="mt-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-[#031f50]">
              Blood group
              <input
                className="mt-2 h-12 w-full rounded-lg border border-[#dae2ee] bg-white px-3 font-normal"
                defaultValue="O+"
              />
            </label>
            <label className="text-xs font-semibold text-[#031f50]">
              Genotype
              <input
                className="mt-2 h-12 w-full rounded-lg border border-[#dae2ee] bg-white px-3 font-normal"
                defaultValue="AA"
              />
            </label>
          </div>
          <div className="mt-3">
            <Badge>Added by you · Not clinically verified</Badge>
          </div>
          <p className="mt-3 text-xs text-[#53657c]">
            These entries are not provider-confirmed history.
          </p>
        </Card>
      </div>
      <div>
        <SectionTitle>Emergency contact · Optional</SectionTitle>
        <Card className="mt-3">
          <p className="text-sm font-semibold text-[#031f50]">Chidi Okafor · Husband</p>
          <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
            +234 803 555 0142
            <br />
            Separate WelliID WR-7204-1683
          </p>
          <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
            Tell Chidi that you are adding his details. This does not give him
            access to your record.
          </p>
          <div className="mt-4">
            <Choice
              selected={informed}
              onClick={() => setInformed(!informed)}
              title="I have informed this contact"
              detail="Contact has been notified of their emergency designation"
              icon={icons.designCheck}
            />
          </div>
        </Card>
      </div>
      <Guidance title="Emergency essentials preview">
        Name & WelliID and emergency contact are included. Blood group and
        genotype are not included yet.
      </Guidance>
      <Guidance title="WelliID is not a national ID">
        NIN linkage is optional. A health identifier does not replace your
        national ID.
      </Guidance>
      <PrimaryButton onClick={() => go("onboardingRecord")}>
        Save basics & continue
      </PrimaryButton>
    </div>
  )
}

export function OnboardingRecordScreen({
  go,
  onComplete,
}: {
  go: (screen: Screen) => void
  onComplete: (next: Screen) => void
}) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Your WelliID is ready. Your new Vault is empty."
        eyebrow="NEW ACCOUNT · STEP 4 OF 4"
        title="Start with one record"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.folderPlus} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">
          No records connected yet
        </h3>
        <p className="mt-3 text-sm leading-[1.45] text-[#53657c]">
          Add one when you are ready. You can also skip this step.
        </p>
      </div>
      <Card className="space-y-4">
        <Row
          detail="Review a connection request and its purpose."
          icon={icons.hospital}
          title="Connect a participating provider"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Choose a PDF or photo from your device."
          icon={icons.upload}
          title="Upload a document"
          onClick={() => go("uploadFailed")}
        />
        <p className="text-xs leading-[1.45] text-[#53657c]">
          Connecting does not automatically give a provider access to your
          other records.
        </p>
      </Card>
      <Guidance title="You will always see the source">
        Provider-issued records show Verified provider. Your uploads show
        Patient Added. Imported records are not automatically verified.
      </Guidance>
      <Guidance title="AI extraction needs your review">
        Check extracted values against the original before confirming.
      </Guidance>
      <PrimaryButton onClick={() => onComplete("records")}>
        Connect a provider
      </PrimaryButton>
      <SecondaryButton onClick={() => go("uploadFailed")}>
        Upload a document
      </SecondaryButton>
      <SecondaryButton onClick={() => onComplete("home")}>
        Skip for now
      </SecondaryButton>
    </div>
  )
}
