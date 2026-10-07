import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import { Card, Guidance, Icon, ScreenStack, SecondaryButton, SectionTitle, Row } from "../components/common";
import { icons } from "../constants/icons";

type Message = { sender: "user" | "ai"; text: string; time?: string };

const INITIAL_MESSAGES: Message[] = [
  {
    sender: "user",
    time: "9:38 AM",
    text: "What happened at my last visit, and what should I ask next?",
  },
  {
    sender: "ai",
    text: "On 28 September, Dr Amaka Bello reviewed your recorded hypertension, continued amlodipine 5 mg daily and requested a full blood count. A ferrous sulfate prescription was also issued. Your 29 September report lists haemoglobin at 10.2 g/dL, below SYNLAB's reference range of 12.0–15.5 g/dL. This result alone does not tell us the cause.",
  },
];

export default function RecordChatScreen() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = () => {
    const text = question.trim();
    if (!text) return;
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text, time: "Just now" },
      {
        sender: "ai",
        text: `Analysis based on your clinical records: For "${text}", your recent tests and consultations suggest maintaining adherence to your morning Amlodipine 5mg and evening Ferrous sulfate 200mg after meals. Remember to bring any questions about fatigue or symptoms to Dr. Amaka Bello on Monday.`,
      },
    ]);
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Ask about my records" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Guidance title="Your permission, your sources">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Record understanding is enabled for this chat: your last
              visit, prescription and blood count only. No provider
              receives this conversation.
            </Text>
          </Guidance>

          <View className="gap-4">
            {messages.map((msg, index) =>
              msg.sender === "user" ? (
                <View
                  className="ml-auto max-w-[88%] rounded-[14px] bg-[#031f50] p-4"
                  key={index}
                >
                  {msg.time && (
                    <Text className="mb-2 text-[10px] text-[#b9c9e3]">
                      YOU · {msg.time}
                    </Text>
                  )}
                  <Text className="text-sm leading-[1.45] text-white">
                    {msg.text}
                  </Text>
                </View>
              ) : (
                <Card key={index}>
                  <View className="flex-row items-center gap-2">
                    <Icon size={20} src={icons.sparklesRecord} />
                    <Text className="text-sm font-semibold text-[#031f50]">
                      From your records
                    </Text>
                  </View>
                  <Text className="mt-4 text-[13px] leading-[1.55] text-[#173b71]">
                    {msg.text}
                  </Text>
                  <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                    For your 5 October follow-up
                  </Text>
                  <View className="mt-3 gap-2">
                    <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                      • What does this blood result mean in my case?
                    </Text>
                    <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                      • Do I need any further tests?
                    </Text>
                    <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                      • How long should I take my prescribed medicines, and
                      when should we review them?
                    </Text>
                  </View>
                  <Text className="mt-4 text-[11px] leading-[1.45] text-[#718096]">
                    No new diagnosis has been added. This is record
                    understanding and education, not medical advice.
                  </Text>
                </Card>
              )
            )}
          </View>

          <SectionTitle
            action="Manage access"
            onAction={() => router.push("/(tabs)/consent-expanded")}
          >
            Sources used
          </SectionTitle>
          <Card className="gap-4">
            <Row
              detail="Dr Bello · Lagoon Hospital · Verified"
              icon={icons.recordStethoscope}
              title="[1] Consultation · 28 Sep"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Dr Bello · Lagoon Hospital · Verified"
              icon={icons.recordPrescription}
              title="[2] Prescription · 28 Sep"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="SYNLAB Ikeja · Verified laboratory report"
              icon={icons.recordLab}
              title="[3] Full blood count · 29 Sep"
            />
          </Card>
          <SecondaryButton onPress={() => router.push("/result")}>
            What does haemoglobin measure? →
          </SecondaryButton>

          <View className="h-14 flex-row items-center rounded-[14px] border border-[#dae2ee] bg-white px-4">
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setQuestion}
              onSubmitEditing={handleSend}
              placeholder="Ask about your record…"
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
