import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import { Badge, Card, Guidance, Icon, Row, ScreenStack } from "../components/common";
import { icons } from "../constants/icons";

type Message = { sender: "user" | "ai"; text: string };

const INITIAL_MESSAGES: Message[] = [
  { sender: "user", text: "What does this result mean?" },
  {
    sender: "ai",
    text: "Your haemoglobin is 10.2 g/dL. SYNLAB's reference range is 12.0–15.5 g/dL, so your value is below this laboratory's range. Haemoglobin is the oxygen-carrying protein in red blood cells. A below-range value alone cannot tell us a diagnosis or cause. Your clinician can interpret it with your history and other tests.",
  },
];

export default function ResultScreen() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = () => {
    const userText = question.trim();
    if (!userText) return;
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      {
        sender: "ai",
        text: `Regarding "${userText}": In the context of your Haemoglobin (10.2 g/dL), mild anaemia is commonly managed with iron supplementation (like your prescribed Ferrous sulfate 200mg) and dietary review. Be sure to discuss this at your upcoming appointment with Dr. Amaka Bello.`,
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Full blood count" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Card>
            <Text className="text-[11px] font-semibold text-[#173b71]">
              ASKING ABOUT THIS RESULT
            </Text>
            <Text className="mt-2 text-lg font-bold text-[#031f50]">
              Full blood count · 29 Sep 2026
            </Text>
            <Text className="mt-2 text-xs text-[#53657c]">
              SYNLAB Ikeja · SL-290926-184
            </Text>
            <Text className="mt-4 text-xs text-[#53657c]">Haemoglobin</Text>
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-bold text-[#031f50]">
                10.2 g/dL
              </Text>
              <Badge tone="amber">Below lab range</Badge>
            </View>
            <Text className="mt-2 text-xs text-[#53657c]">
              Laboratory reference range: 12.0–15.5 g/dL
            </Text>
          </Card>

          <Guidance title="Only this report, only this chat">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Only the selected report is used for clinical context. No
              provider receives this conversation.
            </Text>
          </Guidance>

          <View className="gap-3">
            {messages.map((msg, idx) =>
              msg.sender === "user" ? (
                <View
                  className="ml-auto max-w-[86%] rounded-[14px] bg-[#031f50] p-4"
                  key={idx}
                >
                  <Text className="text-sm text-white">{msg.text}</Text>
                </View>
              ) : (
                <Card key={idx}>
                  <View className="flex-row items-center gap-2">
                    <Icon src={icons.sparkles} />
                    <Text className="text-sm font-semibold text-[#031f50]">
                      WelliRecord · Result explanation
                    </Text>
                  </View>
                  <Text className="mt-3 text-[13px] leading-[1.55] text-[#173b71]">
                    {msg.text}
                  </Text>
                  <View className="my-3 h-px bg-[#dae2ee]" />
                  <Text className="text-[11px] text-[#718096]">
                    This educational explanation is generated here; it is not
                    part of the original laboratory report.
                  </Text>
                </Card>
              )
            )}
          </View>

          <Card onPress={() => router.push("/reports")}>
            <Row
              detail="SYNLAB Ikeja · Collected 29 Sep 2026"
              icon={icons.report}
              title="Original full blood count"
            />
            <View className="mt-3">
              <Badge>Verified provider</Badge>
            </View>
          </Card>

          <Card>
            <Text className="text-[11px] font-semibold text-[#173b71]">
              APPOINTMENT CONTEXT · NOT FROM REPORT
            </Text>
            <Text className="mt-3 text-sm font-semibold text-[#031f50]">
              Questions for your follow-up
            </Text>
            <Text className="mt-2 text-xs text-[#53657c]">
              Dr Amaka Bello · 5 Oct 2026, 10:30 AM
            </Text>
            <View className="mt-3 gap-2">
              <Text className="text-xs text-[#173b71]">
                • What does this haemoglobin result mean for me?
              </Text>
              <Text className="text-xs text-[#173b71]">
                • Do I need any other tests to understand it?
              </Text>
              <Text className="text-xs text-[#173b71]">
                • When should we check my haemoglobin again?
              </Text>
            </View>
          </Card>

          <Guidance title="Education, not a diagnosis" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              No diagnosis or medicine change is made here. Discuss this
              result with your clinician.
            </Text>
          </Guidance>

          <View className="h-14 flex-row items-center rounded-[14px] border border-[#dae2ee] bg-white px-4">
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setQuestion}
              onSubmitEditing={handleSend}
              placeholder="Ask a follow-up question…"
              placeholderTextColor="#718096"
              value={question}
            />
            <Pressable
              accessibilityLabel="Send question"
              accessibilityRole="button"
              className="size-8 items-center justify-center rounded-full bg-[#031f50] active:scale-90"
              onPress={handleSend}
            >
              <Text className="text-sm text-white">↑</Text>
            </Pressable>
          </View>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
