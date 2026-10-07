import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  Row,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import {
  fetchLabs,
  labDate,
  labFlag,
  labRange,
  labSource,
  labValue,
  type LabResult,
} from "../services/labService";

type Message = { sender: "user" | "ai"; text: string };

// Built only from the stored result: no clinical interpretation is added.
function describe(lab: LabResult): string {
  const range = labRange(lab);
  const flag = labFlag(lab);
  const parts = [`Your ${lab.testName} result is ${labValue(lab)}.`];
  if (range) parts.push(`The reference range recorded with it is ${range}.`);
  if (flag) parts.push(`The provider marked it as "${flag.label}".`);
  parts.push(
    "A single value cannot tell us a diagnosis or cause. Your clinician can interpret it with your history and other tests."
  );
  return parts.join(" ");
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [lab, setLab] = useState<LabResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchLabs()
      .then((labs) => {
        if (cancelled) return;
        // Links without an id (timeline, chat) open the latest result.
        const found = id ? labs.find((l) => l._id === id) : labs[0];
        setLab(found ?? null);
        if (found) {
          setMessages([
            { sender: "user", text: "What does this result mean?" },
            { sender: "ai", text: describe(found) },
          ]);
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Could not load result.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSend = () => {
    const userText = question.trim();
    if (!userText) return;
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText },
      {
        sender: "ai",
        text: "Follow-up answers are not available yet. Write this question down and ask your clinician at your next visit.",
      },
    ]);
  };

  const flag = lab ? labFlag(lab) : null;
  const range = lab ? labRange(lab) : null;

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title={lab?.testName ?? "Lab result"} />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
            </View>
          )}

          {!loading && (error || !lab) && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                {error ? "Could not load this result" : "Result not found"}
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                {error ?? "It may have been removed or hidden by your provider."}
              </Text>
              <View className="mt-4">
                <SecondaryButton onPress={() => router.replace("/reports")}>
                  Back to lab results
                </SecondaryButton>
              </View>
            </Card>
          )}

          {!loading && lab && (
            <>
              <Card>
                <Text className="text-[11px] font-semibold text-[#173b71]">
                  ASKING ABOUT THIS RESULT
                </Text>
                <Text className="mt-2 text-lg font-bold text-[#031f50]">
                  {lab.testName} · {labDate(lab)}
                </Text>
                {lab.specimen && (
                  <Text className="mt-2 text-xs text-[#53657c]">
                    Specimen: {lab.specimen}
                  </Text>
                )}
                <View className="mt-4 flex-row flex-wrap items-center gap-2">
                  <Text className="text-2xl font-bold text-[#031f50]">
                    {labValue(lab)}
                  </Text>
                  {flag && <Badge tone={flag.tone}>{flag.label}</Badge>}
                </View>
                {range && (
                  <Text className="mt-2 text-xs text-[#53657c]">
                    Reference range: {range}
                  </Text>
                )}
                {lab.notes && (
                  <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                    Provider note: {lab.notes}
                  </Text>
                )}
              </Card>

              <Guidance title="Only this report, only this chat">
                <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                  Only the selected report is used for context. No provider
                  receives this conversation.
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
                          WelliRecord · Result summary
                        </Text>
                      </View>
                      <Text className="mt-3 text-[13px] leading-[1.55] text-[#173b71]">
                        {msg.text}
                      </Text>
                      <View className="my-3 h-px bg-[#dae2ee]" />
                      <Text className="text-[11px] text-[#718096]">
                        This summary is generated here from the stored result.
                        It is not part of the original laboratory report.
                      </Text>
                    </Card>
                  )
                )}
              </View>

              <Card onPress={() => router.push("/reports")}>
                <Row
                  detail={`Collected ${labDate(lab)}`}
                  icon={icons.report}
                  title={`Original ${lab.testName}`}
                />
                <View className="mt-3">
                  <Badge>{labSource(lab)}</Badge>
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
            </>
          )}
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
