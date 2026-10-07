import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

const sampleReports = [
  [
    "Haemoglobin",
    "12 Aug 2026 · SYNLAB Ikeja",
    "Haemoglobin · 11.1 g/dL",
    "Source not verified",
  ],
  [
    "Lipid profile",
    "18 Jun 2026 · Lagoon Hospital, Ikeja",
    "Transferred from an external record",
    "Imported",
  ],
  [
    "Kidney function",
    "18 Jun 2026 · SYNLAB Ikeja",
    "Issued by the laboratory",
    "Verified provider",
  ],
  [
    "Fasting blood glucose",
    "21 Mar 2026 · Medbury Medical Services",
    "Uploaded by you · source not verified",
    "Patient Added",
  ],
  [
    "Urinalysis",
    "10 Feb 2026 · Lagoon Hospital, Ikeja",
    "Uploaded by you · source not verified",
    "Patient Added",
  ],
] as const;

export default function ReportsScreen() {
  const [search, setSearch] = useState("");

  const filteredReports = sampleReports.filter(
    ([name, date]) =>
      name.toLowerCase().includes(search.toLowerCase()) ||
      date.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Lab results" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="h-[52px] flex-row items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm">
            <Icon src={icons.search} />
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setSearch}
              placeholder="Search a test or provider"
              placeholderTextColor="#718096"
              value={search}
            />
            {search.length > 0 && (
              <Pressable accessibilityRole="button" onPress={() => setSearch("")}>
                <Text className="text-xs text-[#718096]">Clear</Text>
              </Pressable>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-1">
              {["All dates", "Provider", "Source"].map((x) => (
                <Pressable
                  accessibilityRole="button"
                  className="rounded-full border border-[#dae2ee] bg-white px-3 py-2"
                  key={x}
                >
                  <Text className="text-xs font-semibold text-[#031f50]">
                    {x}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View className="flex-row justify-between">
            <Text className="text-sm font-semibold text-[#031f50]">
              6 reports
            </Text>
            <Text className="text-sm font-semibold text-[#031f50]">
              Newest first
            </Text>
          </View>

          <Card onPress={() => router.push("/result")}>
            <View className="flex-row justify-between">
              <Text className="text-[11px] font-semibold text-[#173b71]">
                LATEST REPORT
              </Text>
              <Text className="text-[11px] font-semibold text-[#173b71]">
                Verified provider
              </Text>
            </View>
            <Text className="mt-3 text-lg font-bold text-[#031f50]">
              Full blood count
            </Text>
            <Text className="mt-1 text-xs text-[#53657c]">
              29 Sep 2026 · SYNLAB Ikeja
            </Text>
            <View className="mt-4 rounded-xl bg-[#fbf2e3] p-3">
              <Text className="text-sm font-semibold text-[#031f50]">
                Haemoglobin · 10.2 g/dL
              </Text>
              <Text className="mt-2 text-xs text-[#936020]">
                Below this lab's range: 12.0–15.5 g/dL
              </Text>
              <Text className="mt-2 text-xs text-[#53657c]">
                This flag is for haemoglobin, not the whole panel.
              </Text>
            </View>
            <View className="mt-4">
              <PrimaryButton onPress={() => router.push("/result")}>
                Open latest report
              </PrimaryButton>
            </View>
          </Card>

          <SectionTitle>Earlier reports</SectionTitle>
          {filteredReports.map(([name, date, detail, source]) => (
            <Card className="p-4" key={name}>
              <Text className="text-sm font-semibold text-[#031f50]">
                {name}
              </Text>
              <Text className="mt-1 text-xs text-[#53657c]">{date}</Text>
              <Text className="mt-3 text-xs text-[#53657c]">{detail}</Text>
              <View className="mt-3">
                <Badge>{source}</Badge>
              </View>
            </Card>
          ))}

          <Guidance title="Source labels, not a medical assessment">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Verified provider, Patient Added and Imported describe record
              provenance.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
