import React, { useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  Icon,
  LabeledInput,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

const CHECKLIST = [
  ["Selected medical history", "Hypertension · 28 Sep consultation summary"],
  ["Allergies", "Penicillin · Recorded reaction: rash"],
  ["Current medicines", "Amlodipine 5 mg · Ferrous sulfate 200 mg"],
  ["Selected vaccinations", "Td booster · 18 Jun 2026 · Lagoon Hospital"],
  [
    "Emergency basics & contact",
    "O+ · AA · Chidi Okafor · +234 803 555 0142",
  ],
  ["Selected document", "Td vaccination certificate · 1 PDF"],
] as const;

const RECIPIENTS = [
  "Dr Nina Patel · Travel clinic, London",
  "Dr K. Mensah · Accra Medical Centre",
];

const DURATIONS = [
  "24 hours · Ends 4 Oct 2026, 9:41 AM",
  "7 days · Ends 10 Oct 2026, 9:41 AM",
  "30 days · Ends 2 Nov 2026, 9:41 AM",
];

export default function HealthPassportScreen() {
  const [items, setItems] = useState([true, true, true, true, true, true]);
  const [recipient, setRecipient] = useState(RECIPIENTS[0]);
  const [purpose, setPurpose] = useState("Travel health consultation");
  const [duration, setDuration] = useState(DURATIONS[0]);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Your Health Passport" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Card className="border-[#031f50] bg-[#031f50]">
            <View className="flex-row items-center gap-2">
              <Icon size={20} src={icons.passportGlobe} />
              <Text className="text-sm font-semibold text-white">
                Adaeze Okafor
              </Text>
            </View>
            <Text className="mt-3 text-xs text-[#e0e9f8]">
              WR-4821-0936 · Patient-reviewed summary{"\n"}
              Reviewed by you · 3 Oct 2026, 9:30 AM
            </Text>
          </Card>

          <SectionTitle>Choose what travels with you</SectionTitle>
          <Card className="gap-4">
            {CHECKLIST.map(([title, detail], idx) => (
              <Choice
                detail={detail}
                icon={icons.designCheck}
                key={title}
                onPress={() => {
                  const next = [...items];
                  next[idx] = !next[idx];
                  setItems(next);
                }}
                selected={items[idx]}
                title={title}
              />
            ))}
            <Choice
              detail="Excluded from this passport"
              icon={icons.imaging}
              selected={false}
              title="All lab reports & imaging"
            />
          </Card>

          <SectionTitle>Recipient & duration</SectionTitle>
          <Card className="gap-4">
            <View>
              <Text className="text-xs text-[#53657c]">
                Selected recipient
              </Text>
              <View className="mt-2 gap-2">
                {RECIPIENTS.map((item) => (
                  <Choice
                    detail=""
                    key={item}
                    onPress={() => setRecipient(item)}
                    selected={recipient === item}
                    title={item}
                  />
                ))}
              </View>
            </View>
            <LabeledInput
              label="Purpose"
              onChangeText={setPurpose}
              value={purpose}
            />
            <View>
              <Text className="text-xs text-[#53657c]">
                Secure access duration
              </Text>
              <View className="mt-2 gap-2">
                {DURATIONS.map((item) => (
                  <Choice
                    detail=""
                    key={item}
                    onPress={() => setDuration(item)}
                    selected={duration === item}
                    title={item}
                  />
                ))}
              </View>
            </View>
          </Card>

          <Guidance title="Portable, not unrestricted" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Only your selected summary is included. A secure link can
              expire or be revoked; a downloaded PDF cannot be recalled.
            </Text>
          </Guidance>

          <PrimaryButton
            onPress={() =>
              Alert.alert("PDF export", "PDF export is not available yet.")
            }
          >
            Preview & export selected PDF
          </PrimaryButton>
          <SecondaryButton
            onPress={() => Alert.alert("Exporting in FHIR standard format…")}
          >
            Structured exchange · Where supported
          </SecondaryButton>
          <Text className="text-xs leading-[1.45] text-[#53657c]">
            You can take your data with you without paying for access.
            Original records are preserved.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
