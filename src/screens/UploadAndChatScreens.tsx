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
import { pickImageFromCamera, pickDocument, PickedMediaResult } from "../utils/mediaPicker"

export function RecordChatScreen({ go }: { go: (screen: Screen) => void }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string; time?: string }>
  >([
    {
      sender: "user",
      time: "9:38 AM",
      text: "What happened at my last visit, and what should I ask next?",
    },
    {
      sender: "ai",
      text: "On 28 September, Dr Amaka Bello reviewed your recorded hypertension, continued amlodipine 5 mg daily and requested a full blood count. A ferrous sulfate prescription was also issued. Your 29 September report lists haemoglobin at 10.2 g/dL, below SYNLAB’s reference range of 12.0–15.5 g/dL. This result alone does not tell us the cause.",
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    const text = question.trim()
    setQuestion("")
    setMessages((prev) => [
      ...prev,
      { sender: "user", text, time: "Just now" },
      {
        sender: "ai",
        text: `Analysis based on your clinical records: For "${text}", your recent tests and consultations suggest maintaining adherence to your morning Amlodipine 5mg and evening Ferrous sulfate 200mg after meals. Remember to bring any questions about fatigue or symptoms to Dr. Amaka Bello on Monday.`,
      },
    ])
  }

  return (
    <div className="stack">
      <Guidance title="Your permission, your sources">
        Record understanding is enabled for this chat: your last visit,
        prescription and blood count only. No provider receives this
        conversation.
      </Guidance>

      <div className="space-y-4">
        {messages.map((msg, index) =>
          msg.sender === "user" ? (
            <div
              key={index}
              className="ml-auto max-w-[88%] rounded-[14px] bg-[#031f50] p-4 text-sm leading-[1.45] text-white shadow-sm"
            >
              {msg.time && (
                <p className="mb-2 text-[10px] text-[#b9c9e3]">YOU · {msg.time}</p>
              )}
              {msg.text}
            </div>
          ) : (
            <Card key={index}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#031f50]">
                <Icon size={20} src={icons.sparklesRecord} />
                From your records
              </div>
              <p className="mt-4 text-[13px] leading-[1.55] text-[#173b71]">
                {msg.text}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#031f50]">
                For your 5 October follow-up
              </p>
              <ul className="mt-3 space-y-2 text-[13px] leading-[1.45] text-[#173b71]">
                <li>• What does this blood result mean in my case?</li>
                <li>• Do I need any further tests?</li>
                <li>
                  • How long should I take my prescribed medicines, and when should
                  we review them?
                </li>
              </ul>
              <p className="mt-4 text-[11px] leading-[1.45] text-[#718096]">
                No new diagnosis has been added. This is record understanding and
                education, not medical advice.
              </p>
            </Card>
          ),
        )}
      </div>

      <SectionTitle action="Manage access" onAction={() => go("consentExpanded")}>
        Sources used
      </SectionTitle>
      <Card className="space-y-4">
        <Row
          detail="Dr Bello · Lagoon Hospital · Verified"
          icon={icons.recordStethoscope}
          title="[1] Consultation · 28 Sep"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="Dr Bello · Lagoon Hospital · Verified"
          icon={icons.recordPrescription}
          title="[2] Prescription · 28 Sep"
        />
        <div className="h-px bg-[#dae2ee]" />
        <Row
          detail="SYNLAB Ikeja · Verified laboratory report"
          icon={icons.recordLab}
          title="[3] Full blood count · 29 Sep"
        />
      </Card>
      <SecondaryButton onClick={() => go("result")}>
        What does haemoglobin measure? →
      </SecondaryButton>
      <form
        className="flex h-14 items-center rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm focus-within:border-[#24518c]"
        onSubmit={handleSend}
      >
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#718096]"
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about your record…"
          value={question}
        />
        <button
          aria-label="Send question"
          className="flex size-8 items-center justify-center rounded-full bg-[#031f50] text-sm text-white transition-transform active:scale-90"
          type="submit"
        >
          ↑
        </button>
      </form>
    </div>
  )
}

export function UploadReviewScreen({ onAdd }: { onAdd: () => void }) {
  const [reviewed, setReviewed] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<PickedMediaResult | null>(null)
  const [scanning, setScanning] = useState(false)

  const handlePickDocument = async () => {
    const file = await pickDocument()
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleCameraCapture = async () => {
    setScanning(true)
    const file = await pickImageFromCamera()
    setScanning(false)
    if (file) {
      setUploadedFile(file)
    }
  }

  const fields = [
    ["Test name", "Haemoglobin"],
    ["Result", "10.2"],
    ["Units", "g/dL"],
    ["Laboratory reference range", "12.0–15.5 g/dL"],
    ["Report date", "29 Sep 2026"],
    ["Laboratory", "SYNLAB Ikeja"],
  ]

  return (
    <div className="stack">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handlePickDocument}
          className="flex items-center gap-1.5 rounded-full bg-[#031f50] px-3.5 py-2 text-xs font-semibold text-white transition-opacity active:opacity-80"
        >
          <Icon size={14} src={icons.uploadReview} />
          Choose PDF / File
        </button>
        <button
          onClick={handleCameraCapture}
          className="flex items-center gap-1.5 rounded-full bg-[#edf2fa] px-3.5 py-2 text-xs font-semibold text-[#031f50] hover:bg-[#e2eaf5] transition-opacity active:opacity-80"
        >
          <Icon size={14} src={icons.camera} />
          {scanning ? "Scanning..." : "Open Camera"}
        </button>
        <button
          onClick={handleCameraCapture}
          className="flex items-center gap-1.5 rounded-full bg-[#edf2fa] px-3.5 py-2 text-xs font-semibold text-[#031f50] hover:bg-[#e2eaf5] transition-opacity active:opacity-80"
        >
          <Icon size={14} src={icons.scanDocument} />
          Scan Rx Slip
        </button>
      </div>

      <div className="rounded-[20px] bg-[#edf2fa] p-5">
        <div className="rounded-sm bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#031f50]">SYNLAB · LABORATORY REPORT</p>
            {uploadedFile && (
              <span className="text-[9px] font-medium bg-[#10b981]/10 text-[#059669] px-2 py-0.5 rounded-full">
                Custom Upload
              </span>
            )}
          </div>
          <p className="mt-3 text-[9px] text-[#53657c]">
            Adaeze Okafor · 29 Sep 2026
            <br />
            SL-290926-184 · Full blood count
          </p>
          <div className="mt-4 flex justify-between border-b border-[#dae2ee] pb-2 text-[9px]">
            <span>Haemoglobin</span>
            <strong className="text-[#031f50]">10.2 g/dL</strong>
            <span>12.0–15.5</span>
          </div>
          <div className="mt-2 h-1 bg-[#dae2ee]" />
          <div className="mt-2 h-1 bg-[#dae2ee]" />
        </div>
        <div className="mt-4 flex justify-between text-[11px] text-[#53657c]">
          <span>{uploadedFile ? uploadedFile.name : "blood-count-sep.pdf · 284 KB"}</span>
          <span>Page 1 / 2</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge>Patient-uploaded</Badge>
        <Badge tone="amber">AI Extracted · Unconfirmed</Badge>
      </div>
      <h2 className="text-lg font-bold text-[#031f50]">
        We found the following information. Review before adding it to your
        record.
      </h2>
      <Card>
        <label className="text-xs text-[#53657c]">
          Category
          <select className="mt-2 h-12 w-full rounded-lg border border-[#031f50] bg-white px-3 text-sm font-semibold text-[#031f50] outline-none">
            <option>Laboratory</option>
            <option>Prescription</option>
            <option>Consultation Summary</option>
            <option>Imaging Report</option>
          </select>
        </label>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {fields.map(([label, value], index) => (
            <label
              className={`text-xs text-[#53657c] ${
                index === 0 || index === 3 ? "col-span-2" : ""
              }`}
              key={label}
            >
              {label}
              <span className="mt-2 flex min-h-12 items-center justify-between rounded-lg border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50]">
                {value}
                <Icon size={15} src={icons.pencil} />
              </span>
            </label>
          ))}
        </div>
      </Card>
      <Guidance title="Possible duplicate found" tone="amber">
        This may match your verified SYNLAB report. Compare the files before
        saving. We will not auto-merge or replace either record.
      </Guidance>
      <Choice
        selected={reviewed}
        detail="Saving retains the original file and the AI extraction label. It does not verify the laboratory source."
        onClick={() => setReviewed(!reviewed)}
        title="I reviewed the extracted fields"
        icon={icons.designCheck}
      />
      <PrimaryButton
        disabled={!reviewed}
        onClick={reviewed ? onAdd : undefined}
      >
        Confirm & add as Patient Added
      </PrimaryButton>
      <p className="text-center text-[11px] text-[#53657c]">
        No diagnosis is inferred. AI never silently rewrites your medical
        history.
      </p>
    </div>
  )
}

export function RecordAddedScreen({ go }: { go: (screen: Screen) => void }) {
  return (
    <div className="stack">
      <div className="flex flex-col items-center rounded-[20px] bg-[#edf2fa] p-[22px] text-center">
        <span className="flex size-[60px] items-center justify-center rounded-full bg-[#031f50]">
          <Icon size={28} src={icons.success} />
        </span>
        <h2 className="mt-4 text-[22px] font-bold text-[#031f50]">Record added</h2>
        <p className="mt-3 text-sm leading-[1.45] text-[#53657c]">
          Full blood count.pdf is now part of your health record.
        </p>
      </div>
      <Card>
        <Row
          detail="29 Sep 2026 · SYNLAB Ikeja"
          icon={icons.recordLab}
          title="Full blood count"
        />
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>Patient Added</Badge>
          <Badge tone="amber">AI Extracted · Reviewed</Badge>
        </div>
        <p className="mt-4 text-xs leading-[1.45] text-[#53657c]">
          The original PDF is retained. This does not verify the laboratory
          source or infer a diagnosis.
        </p>
      </Card>
      <PrimaryButton onClick={() => go("reports")}>View record</PrimaryButton>
      <SecondaryButton onClick={() => go("records")}>
        Return to My Health
      </SecondaryButton>
    </div>
  )
}
