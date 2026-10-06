import React, { useState } from "react"
import { Badge, Card, Guidance, Icon, Row } from "../components/common"
import { icons } from "../constants/icons"
import { Screen } from "../types/navigation"

export function ResultScreen({ go }: { go: (screen: Screen) => void }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<
    Array<{ sender: "user" | "ai"; text: string }>
  >([
    {
      sender: "user",
      text: "What does this result mean?",
    },
    {
      sender: "ai",
      text: "Your haemoglobin is 10.2 g/dL. SYNLAB’s reference range is 12.0–15.5 g/dL, so your value is below this laboratory’s range. Haemoglobin is the oxygen-carrying protein in red blood cells. A below-range value alone cannot tell us a diagnosis or cause. Your clinician can interpret it with your history and other tests.",
    },
  ])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    const userText = question.trim()
    setQuestion("")
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      {
        sender: "ai",
        text: `Regarding "${userText}": In the context of your Haemoglobin (10.2 g/dL), mild anaemia is commonly managed with iron supplementation (like your prescribed Ferrous sulfate 200mg) and dietary review. Be sure to discuss this at your upcoming appointment with Dr. Amaka Bello.`,
      },
    ])
  }

  return (
    <div className="stack">
      <Card>
        <p className="text-[11px] font-semibold text-[#173b71]">
          ASKING ABOUT THIS RESULT
        </p>
        <h2 className="mt-2 text-lg font-bold text-[#031f50]">
          Full blood count · 29 Sep 2026
        </h2>
        <p className="mt-2 text-xs text-[#53657c]">
          SYNLAB Ikeja · SL-290926-184
        </p>
        <p className="mt-4 text-xs text-[#53657c]">Haemoglobin</p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-[#031f50]">10.2 g/dL</p>
          <Badge tone="amber">Below lab range</Badge>
        </div>
        <p className="mt-2 text-xs text-[#53657c]">
          Laboratory reference range: 12.0–15.5 g/dL
        </p>
      </Card>

      <Guidance title="Only this report, only this chat">
        Only the selected report is used for clinical context. No provider
        receives this conversation.
      </Guidance>

      <div className="space-y-3">
        {messages.map((msg, idx) =>
          msg.sender === "user" ? (
            <div
              key={idx}
              className="ml-auto max-w-[86%] rounded-[14px] bg-[#031f50] p-4 text-sm text-white shadow-sm"
            >
              {msg.text}
            </div>
          ) : (
            <Card key={idx}>
              <div className="flex items-center gap-2 text-sm font-semibold text-[#031f50]">
                <Icon src={icons.sparkles} />
                WelliRecord · Result explanation
              </div>
              <p className="mt-3 text-[13px] leading-[1.55] text-[#173b71]">
                {msg.text}
              </p>
              <div className="my-3 h-px bg-[#dae2ee]" />
              <p className="text-[11px] text-[#718096]">
                This educational explanation is generated here; it is not part of the
                original laboratory report.
              </p>
            </Card>
          ),
        )}
      </div>

      <Card onClick={() => go("reports")}>
        <Row
          detail="SYNLAB Ikeja · Collected 29 Sep 2026"
          icon={icons.report}
          title="Original full blood count"
        />
        <div className="mt-3">
          <Badge>Verified provider</Badge>
        </div>
      </Card>

      <Card>
        <p className="text-[11px] font-semibold text-[#173b71]">
          APPOINTMENT CONTEXT · NOT FROM REPORT
        </p>
        <p className="mt-3 text-sm font-semibold text-[#031f50]">
          Questions for your follow-up
        </p>
        <p className="mt-2 text-xs text-[#53657c]">
          Dr Amaka Bello · 5 Oct 2026, 10:30 AM
        </p>
        <ul className="mt-3 space-y-2 text-xs text-[#173b71]">
          <li>• What does this haemoglobin result mean for me?</li>
          <li>• Do I need any other tests to understand it?</li>
          <li>• When should we check my haemoglobin again?</li>
        </ul>
      </Card>

      <Guidance title="Education, not a diagnosis" tone="amber">
        No diagnosis or medicine change is made here. Discuss this result with
        your clinician.
      </Guidance>

      <form
        className="flex h-14 items-center rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm focus-within:border-[#24518c]"
        onSubmit={handleSend}
      >
        <input
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#718096]"
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a follow-up question…"
          value={question}
        />
        <button
          className="flex size-8 items-center justify-center rounded-full bg-[#031f50] text-sm text-white transition-transform active:scale-90"
          aria-label="Send question"
          type="submit"
        >
          ↑
        </button>
      </form>
    </div>
  )
}
