import React, { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

const CHECKLIST = [
  ["Confirm your allergy", "Penicillin · Rash · Provider confirmed"],
  ["Review current medicines", "Amlodipine 5 mg · Ferrous sulfate 200 mg"],
  [
    "Complete pre-visit questionnaire",
    "How you feel today · Saved as Patient Added",
  ],
  ["Choose previous reports to share", "SYNLAB full blood count · 29 Sep"],
];

export default function VisitPrepScreen() {
  const [ready, setReady] = useState([true, true, false, false]);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Prepare for your visit" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Card className="border-[#031f50] bg-[#031f50]">
            <View className="flex-row gap-4">
              <View className="items-center rounded-xl bg-white px-3 py-2">
                <Text className="text-[10px] font-bold text-[#031f50]">
                  OCT
                </Text>
                <Text className="mt-1 text-2xl font-bold text-[#031f50]">
                  05
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">
                  Monday · 10:30 AM
                </Text>
                <Text className="mt-1 text-xs text-[#e0e9f8]">
                  Hypertension follow-up · 30 min
                </Text>
                <Text className="mt-1 text-[11px] text-[#b9c9e3]">
                  Appointment LG-051026-073
                </Text>
              </View>
            </View>
            <Text className="mt-5 text-sm font-semibold text-white">
              Dr Amaka Bello
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#e0e9f8]">
              Lagoon Hospital, Ikeja · Internal medicine{"\n"}3 Obafemi
              Awolowo Way · Get directions →
            </Text>
          </Card>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <SecondaryButton onPress={() => router.push("/booking-time")}>
                Reschedule
              </SecondaryButton>
            </View>
            <View className="flex-1">
              <SecondaryButton
                onPress={() =>
                  Alert.alert("Cancellation policy: contact clinic 24h prior")
                }
              >
                Cancel visit
              </SecondaryButton>
            </View>
          </View>
          <SectionTitle>
            Your preparation checklist · {ready.filter(Boolean).length} of 4
            ready
          </SectionTitle>
          <Card className="gap-4">
            {CHECKLIST.map(([title, detail], index) => (
              <Choice
                detail={detail}
                icon={icons.clipboard}
                key={title}
                onPress={() => {
                  const next = [...ready];
                  next[index] = !next[index];
                  setReady(next);
                }}
                selected={ready[index]}
                title={title}
              />
            ))}
          </Card>
          <Card>
            <View className="flex-row items-center gap-2">
              <Icon src={icons.sparklesRecord} />
              <Text className="text-sm font-semibold text-[#031f50]">
                Your visit brief · AI prepared
              </Text>
            </View>
            <Text className="mt-4 text-xs leading-[1.5] text-[#173b71]">
              Last visit: hypertension review on 28 Sep. Two current
              medicines. Latest haemoglobin: 10.2 g/dL, below the lab's
              range. Review this summary before sharing.
            </Text>
            <Text className="mt-3 text-xs leading-[1.5] text-[#173b71]">
              Ask your clinician: What does my result mean? When should we
              repeat the test? What is the plan for my medicines?
            </Text>
          </Card>
          <Guidance title="Coverage check">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Reliance HMO is active. Consultation authorization is
              confirmed: RL-AU-51073. Additional tests may need separate
              approval.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/record-chat")}>
            Review visit summary & sharing
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/check-in")}>
            Continue to check-in
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
