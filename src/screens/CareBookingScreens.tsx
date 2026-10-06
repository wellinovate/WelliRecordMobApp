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

export function BookingTimeScreen({ go }: { go: (screen: Screen) => void }) {
  const [date, setDate] = useState("05")
  const [time, setTime] = useState("10:30 AM")

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="A 30-minute consultation, in person."
        eyebrow="BOOKING · SELECT A TIME"
        title="Choose your visit time"
      />
      <Card>
        <Row
          detail="Internal medicine · Lagoon Hospital, Ikeja"
          icon={icons.stethoscope}
          title="Dr Amaka Bello"
        />
        <div className="mt-3">
          <Badge>Verified provider</Badge>
        </div>
        <p className="mt-4 text-sm text-[#53657c]">
          3 Obafemi Awolowo Way, Ikeja, Lagos
        </p>
        <p className="mt-3 text-xs text-[#53657c]">
          Reliance accepted · Service eligibility and authorization checked at
          review.
        </p>
      </Card>
      <div>
        <h3 className="text-lg font-bold text-[#031f50]">October 2026</h3>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            ["Mon", "05"],
            ["Tue", "06"],
            ["Wed", "07"],
            ["Thu", "08"],
          ].map(([day, number]) => (
            <button
              className={`rounded-[14px] py-3 transition-all ${
                date === number
                  ? "bg-[#031f50] text-white shadow-md"
                  : "bg-[#edf2fa] text-[#53657c] hover:bg-[#e2eaf5]"
              }`}
              key={number}
              onClick={() => setDate(number)}
            >
              <span className="block text-xs">{day}</span>
              <span className="mt-1 block text-2xl font-bold">{number}</span>
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#031f50]">Mon, {date} Oct · Africa/Lagos</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["9:30 AM", "10:30 AM", "11:30 AM"].map((item) => (
            <button
              className={`h-12 rounded-xl border text-sm font-semibold transition-all ${
                time === item
                  ? "border-[#031f50] bg-[#031f50] text-white shadow-sm"
                  : "border-[#dae2ee] bg-white text-[#031f50] hover:bg-[#edf2fa]"
              }`}
              key={item}
              onClick={() => setTime(item)}
            >
              {time === item ? "✓ " : ""}
              {item}
            </button>
          ))}
        </div>
      </div>
      <Guidance title={`Selected · ${date} Oct at ${time}`}>
        Times shown are a sample of provider availability. The slot is not
        reserved until booking is confirmed.
      </Guidance>
      <PrimaryButton onClick={() => go("bookingReview")}>
        Review booking
      </PrimaryButton>
      <SecondaryButton onClick={() => alert("Showing next available week: 12-16 Oct")}>
        See other dates
      </SecondaryButton>
    </div>
  )
}

export function BookingReviewScreen({
  go,
  onConfirm,
}: {
  go: (screen: Screen) => void
  onConfirm: () => void
}) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Check your visit and costs before confirming."
        eyebrow="BOOKING · REVIEW"
        title="Review your booking"
      />
      <Card>
        <Row
          detail="Internal medicine · Verified provider"
          icon={icons.stethoscope}
          title="Dr Amaka Bello"
        />
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          Mon, 5 Oct 2026 · 10:30 AM · 30 min
        </p>
        <p className="mt-4 text-sm leading-[1.45] text-[#53657c]">
          Lagoon Hospital, Ikeja
          <br />
          3 Obafemi Awolowo Way
          <br />
          Reason: hypertension follow-up
        </p>
        <p className="mt-4 text-xs text-[#53657c]">
          Time zone: Africa/Lagos
        </p>
      </Card>
      <SectionTitle>Coverage & registration</SectionTitle>
      <Card>
        <Badge>Consultation authorized</Badge>
        <p className="mt-4 text-sm font-semibold text-[#031f50]">
          Reliance HMO · RL-AU-51073
        </p>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          Member RL-209184 · Active through 31 Dec 2026. Tests may need separate
          authorization.
        </p>
        <p className="mt-4 text-sm font-semibold text-[#031f50]">₦5,000 registration fee</p>
        <p className="mt-2 text-xs text-[#53657c]">
          Not covered by HMO · Separate bill LG-B051026-073.
        </p>
      </Card>
      <Guidance title="Booking information only">
        Send your name, WelliID, verified contact, selected clinician/time,
        reason and HMO authorization. No lab reports are included.
      </Guidance>
      <Guidance title="Sharing is a separate choice">
        Confirming this booking does not grant clinical record access.
      </Guidance>
      <PrimaryButton onClick={onConfirm}>Confirm booking</PrimaryButton>
      <SecondaryButton onClick={() => go("bookingTime")}>
        Change visit details
      </SecondaryButton>
    </div>
  )
}

export function BookingConfirmedScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Keep your appointment details close."
        eyebrow="BOOKING OUTCOME · BEFORE THE VISIT"
        title="Your visit is booked"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.calendarCheck} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">Booking confirmed</h3>
        <p className="mt-3 text-sm text-[#53657c]">
          Appointment LG-051026-073
        </p>
      </div>
      <Card className="border-[#031f50] bg-[#031f50] text-white">
        <p className="text-xl font-bold">Mon, 5 Oct 2026 · 10:30 AM</p>
        <p className="mt-4 text-sm text-[#e0e9f8]">30 min · Africa/Lagos</p>
        <p className="mt-4 text-sm font-semibold">
          Dr Amaka Bello · Internal medicine
        </p>
        <p className="mt-4 text-sm text-[#e0e9f8]">
          Lagoon Hospital, Ikeja
          <br />3 Obafemi Awolowo Way
        </p>
      </Card>
      <Guidance title="Record access ends before this visit" tone="amber">
        C-1031 ends 4 Oct at 9:41 AM. Booking has not extended access. Review
        sharing separately if you want access during the visit.
      </Guidance>
      <PrimaryButton onClick={() => go("visitPrep")}>
        Prepare for your visit
      </PrimaryButton>
      <Card>
        <Row
          detail="Lagoon Hospital, Ikeja"
          icon={icons.mapPin}
          title="Get directions"
          onClick={() => alert("Opening navigation map to Lagoon Hospital, Ikeja")}
        />
      </Card>
      <Card>
        <Row
          detail="1 day before · No health details on lock screen"
          icon={icons.bell}
          title="In-app reminder · On"
        />
      </Card>
      <SecondaryButton onClick={() => go("bookingTime")}>
        Reschedule
      </SecondaryButton>
    </div>
  )
}

export function CheckInScreen({
  onCheckIn,
}: {
  onCheckIn: () => void
}) {
  const [camera, setCamera] = useState(false)

  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="At the participating hospital? Match your visit first."
        eyebrow="ARRIVAL · 5 OCT 2026 · BEFORE CHECK-IN"
        title="Check in at Lagoon"
      />
      <Card>
        <Badge>Matched appointment</Badge>
        <div className="mt-4">
          <Row
            detail="WR-4821-0936 · LG-051026-073"
            icon={icons.calendarCheck}
            title="Adaeze Okafor"
          />
        </div>
        <p className="mt-4 text-xs leading-[1.45] text-[#53657c]">
          Dr Amaka Bello · Today, 10:30 AM. Confirm facility and appointment
          with reception.
        </p>
      </Card>
      <div className="flex min-h-[176px] flex-col items-center justify-center rounded-[20px] border border-[#dae2ee] bg-[#edf2fa] text-center p-6">
        <Icon size={54} src={icons.scanCheckin} />
        <p className="mt-5 text-sm font-semibold text-[#031f50]">
          {camera ? "Camera scanning active · Point at desk QR" : "Camera scanner ready"}
        </p>
      </div>
      <p className="text-sm leading-[1.45] text-[#53657c]">
        Allow camera access to scan the facility check-in QR. Used only for
        scanning; you can enter your WelliID instead.
      </p>
      <PrimaryButton
        onClick={() => {
          if (camera) onCheckIn()
          else setCamera(true)
        }}
      >
        {camera ? "Confirm QR scan & check in" : "Allow camera & scan facility QR"}
      </PrimaryButton>
      <label>
        <span className="text-sm font-semibold text-[#031f50]">Or enter your WelliID</span>
        <input
          className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm outline-none"
          defaultValue="WR-4821-0936"
        />
      </label>
      <SecondaryButton onClick={onCheckIn}>
        Check in with WelliID
      </SecondaryButton>
      <Guidance title="Check-in is not record sharing">
        The QR opens a secure, minimum-necessary endpoint. Your record-sharing
        scope stays separate.
      </Guidance>
    </div>
  )
}

export function CheckedInScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <ScreenIntroHeader
        copy="Lagoon Hospital, Ikeja · Keep your phone with you."
        eyebrow="ARRIVAL OUTCOME · 5 OCT 2026, 9:20 AM"
        title="You’re checked in"
      />
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.clipboard} />
        </span>
        <h3 className="mt-4 text-[22px] font-bold text-[#031f50]">
          Registration confirmed
        </h3>
        <p className="mt-3 text-sm text-[#53657c]">
          Checked in 5 Oct 2026 at 9:20 AM · Africa/Lagos
        </p>
      </div>
      <Card>
        <p className="text-sm font-semibold text-[#031f50]">
          Adaeze Okafor · WR-4821-0936
        </p>
        <p className="mt-4 text-sm leading-[1.45] text-[#53657c]">
          Visit LG-051026-073
          <br />
          Dr Amaka Bello · 10:30 AM appointment
        </p>
        <div className="mt-4">
          <Badge>Facility-confirmed check-in</Badge>
        </div>
      </Card>
      <SectionTitle>Next in your care</SectionTitle>
      <Card className="space-y-4">
        <Row
          detail="WelliID matched · 9:20 AM"
          icon={icons.success}
          title="Registration · Complete"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Not started yet. Reception will guide you."
          icon={icons.history}
          title="Triage · Next"
        />
      </Card>
      <Guidance title="Please stay near the waiting area">
        Visit timing may change. Ask reception if you need help or if your
        symptoms worsen.
      </Guidance>
      <PrimaryButton onClick={() => go("careJourney")}>
        View care journey
      </PrimaryButton>
      <SecondaryButton onClick={() => go("bookingConfirmed")}>
        View appointment details
      </SecondaryButton>
    </div>
  )
}

export function CareDiscoveryScreen({ go }: { go: (screen: Screen) => void }) {
  const [filter, setFilter] = useState("All providers")

  return (
    <div className="stack">
      <button className="flex items-center gap-2 text-xs font-semibold text-[#24518c]">
        <Icon size={16} src={icons.careMapPin} />
        Ikeja, Lagos · Set manually
      </button>
      <label className="flex h-[52px] items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm focus-within:border-[#24518c]">
        <Icon src={icons.search} />
        <input
          className="w-full bg-transparent text-sm outline-none placeholder:text-[#718096]"
          placeholder="What care do you need?"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {["All providers", "Reliance HMO", "Open now", "Specialty"].map(
          (item) => (
            <button
              className={`rounded-full border px-3 py-2 text-[11px] font-semibold transition-all ${
                filter === item
                  ? "border-[#031f50] bg-[#031f50] text-white shadow-sm"
                  : "border-[#dae2ee] bg-white text-[#031f50] hover:bg-[#edf2fa]"
              }`}
              key={item}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ),
        )}
      </div>
      <SectionTitle>Your connected hospital</SectionTitle>
      <Card className="overflow-hidden p-0 shadow-sm">
        <img
          alt="Lagoon Hospital exterior"
          className="h-44 w-full object-cover"
          src={icons.hospitalPhoto}
        />
        <div className="p-[18px]">
          <h3 className="text-lg font-bold text-[#031f50]">Lagoon Hospital, Ikeja</h3>
          <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
            Hospital · 2.1 km · Open 24 hours
            <br />3 Obafemi Awolowo Way, Ikeja
          </p>
          <div className="mt-3 flex gap-2">
            <Badge>Participating</Badge>
            <Badge>Reliance accepted</Badge>
          </div>
          <div className="mt-4">
            <PrimaryButton onClick={() => go("bookingTime")}>
              Book an appointment
            </PrimaryButton>
          </div>
        </div>
      </Card>
      <SectionTitle action="Map view">More ways to get care</SectionTitle>
      <Card>
        <Row
          detail="Laboratory · 1.4 km · Today, 8 AM–4 PM"
          icon={icons.lab}
          title="SYNLAB Ikeja"
          onClick={() => go("reports")}
        />
        <p className="mt-4 text-xs text-[#53657c]">
          Participating provider · Reliance: eligible tests
        </p>
      </Card>
      <Card>
        <Row
          detail="Pharmacy · 0.8 km · Open until 9 PM"
          icon={icons.pill}
          title="HealthPlus, Ikeja"
        />
        <p className="mt-4 text-xs text-[#53657c]">
          Participating provider · Reliance: approved prescriptions
        </p>
      </Card>
      <Card>
        <Row
          detail="Internal medicine · Lagoon Hospital · Mon, 5 Oct"
          icon={icons.stethoscope}
          title="Dr Amaka Bello"
          onClick={() => go("bookingTime")}
        />
      </Card>
      <p className="text-xs leading-[1.45] text-[#53657c]">
        Coverage may require HMO authorization. Confirm eligibility and opening
        times with the provider.
      </p>
    </div>
  )
}

export function VisitPrepScreen({ go }: { go: (screen: Screen) => void }) {
  const [ready, setReady] = useState([true, true, false, false])
  const items = [
    ["Confirm your allergy", "Penicillin · Rash · Provider confirmed"],
    ["Review current medicines", "Amlodipine 5 mg · Ferrous sulfate 200 mg"],
    [
      "Complete pre-visit questionnaire",
      "How you feel today · Saved as Patient Added",
    ],
    ["Choose previous reports to share", "SYNLAB full blood count · 29 Sep"],
  ]

  return (
    <div className="stack">
      <Card className="border-[#031f50] bg-[#031f50] text-white">
        <div className="grid grid-cols-[56px_1fr] gap-4">
          <div className="rounded-xl bg-white p-2 text-center text-[#031f50]">
            <span className="text-[10px] font-bold">OCT</span>
            <span className="mt-1 block text-2xl font-bold">05</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Monday · 10:30 AM</p>
            <p className="mt-1 text-xs text-[#e0e9f8]">
              Hypertension follow-up · 30 min
            </p>
            <p className="mt-1 text-[11px] text-[#b9c9e3]">
              Appointment LG-051026-073
            </p>
          </div>
        </div>
        <p className="mt-5 text-sm font-semibold">Dr Amaka Bello</p>
        <p className="mt-3 text-xs leading-[1.45] text-[#e0e9f8]">
          Lagoon Hospital, Ikeja · Internal medicine
          <br />3 Obafemi Awolowo Way · Get directions →
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <SecondaryButton onClick={() => go("bookingTime")}>
          Reschedule
        </SecondaryButton>
        <SecondaryButton onClick={() => alert("Cancellation policy: contact clinic 24h prior")}>
          Cancel visit
        </SecondaryButton>
      </div>
      <SectionTitle>
        Your preparation checklist · {ready.filter(Boolean).length} of 4 ready
      </SectionTitle>
      <Card className="space-y-4">
        {items.map(([title, detail], index) => (
          <Choice
            selected={ready[index]}
            detail={detail}
            key={title}
            onClick={() => {
              const next = [...ready]
              next[index] = !next[index]
              setReady(next)
            }}
            title={title}
            icon={icons.clipboard}
          />
        ))}
      </Card>
      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-[#031f50]">
          <Icon src={icons.sparklesRecord} />
          Your visit brief · AI prepared
        </div>
        <p className="mt-4 text-xs leading-[1.5] text-[#173b71]">
          Last visit: hypertension review on 28 Sep. Two current medicines.
          Latest haemoglobin: 10.2 g/dL, below the lab’s range. Review this
          summary before sharing.
        </p>
        <p className="mt-3 text-xs leading-[1.5] text-[#173b71]">
          Ask your clinician: What does my result mean? When should we repeat
          the test? What is the plan for my medicines?
        </p>
      </Card>
      <Guidance title="Coverage check">
        Reliance HMO is active. Consultation authorization is confirmed:
        RL-AU-51073. Additional tests may need separate approval.
      </Guidance>
      <PrimaryButton onClick={() => go("recordChat")}>
        Review visit summary & sharing
      </PrimaryButton>
      <SecondaryButton onClick={() => go("checkIn")}>
        Continue to check-in
      </SecondaryButton>
    </div>
  )
}

export function CareJourneyScreen({ go }: { go: (screen: Screen) => void }) {
  const steps = [
    ["Registration", "WelliID verified · 9:20 AM", true],
    ["Triage", "Vitals recorded · 9:32 AM", true],
    ["Doctor · You are here", "Dr Amaka Bello · Appointment 10:30 AM", false],
    ["Laboratory", "Only if ordered by your clinician", false],
    ["Pharmacy", "Review any prescription after your visit", false],
    ["Payment & complete", "Review final bill and visit summary", false],
  ] as const

  return (
    <div className="stack">
      <Guidance title="Adaeze · WR-4821-0936">
        Visit LG-051026-073 · Checked in at 9:20 AM
        <br />
        You can keep your phone with you.
      </Guidance>
      <SectionTitle>Your care journey</SectionTitle>
      <Card>
        {steps.map(([title, detail, complete], index) => (
          <div className="grid grid-cols-[32px_1fr] gap-3" key={title}>
            <div className="flex flex-col items-center">
              <span
                className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
                  index === 2 || complete
                    ? "bg-[#031f50] text-white"
                    : "bg-[#edf2fa] text-[#53657c]"
                }`}
              >
                {complete ? <Icon size={14} src={icons.check} /> : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className="min-h-8 w-0.5 flex-1 bg-[#dae2ee]" />
              )}
            </div>
            <div className="pb-5">
              <p className="text-sm font-semibold text-[#031f50]">{title}</p>
              <p className="mt-1 text-xs text-[#53657c]">{detail}</p>
            </div>
          </div>
        ))}
      </Card>
      <Guidance title="Waiting for your clinician">
        Please stay near the waiting area. Your slot is at 10:30 AM; timing may
        change. Ask reception if you need help or your symptoms worsen.
      </Guidance>
      <SectionTitle>This visit’s healthcare bill</SectionTitle>
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#031f50]">WelliPay</p>
          <Badge tone="amber">Payment due</Badge>
        </div>
        <p className="mt-5 text-[27px] font-bold text-[#031f50]">₦5,000</p>
        <p className="mt-3 text-xs leading-[1.45] text-[#53657c]">
          Bill LG-B051026-073
          <br />
          Registration fee · Not covered by HMO
          <br />
          Consultation: Reliance authorization confirmed.
          <br />
          No additional test charges yet.
        </p>
        <div className="mt-5">
          <PrimaryButton onClick={() => alert("Opening WelliPay instant payment gateway...")}>
            View & pay healthcare bill
          </PrimaryButton>
        </div>
        <button className="mt-4 text-xs font-semibold text-[#24518c] hover:underline">
          Request family payment · Bill only
        </button>
      </Card>
      <p className="text-xs leading-[1.45] text-[#53657c]">
        A payment request shares bill details, not your health record. Every
        authorized record access is logged.
      </p>
      <SecondaryButton onClick={() => go("home")}>
        Return to home
      </SecondaryButton>
    </div>
  )
}
