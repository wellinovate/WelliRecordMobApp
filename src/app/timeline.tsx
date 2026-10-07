import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import { Badge, Card, Guidance, Icon, ScreenStack } from "../components/common";
import { icons } from "../constants/icons";

const timelineItems = [
  [
    "30 Sep 2026",
    icons.pill,
    "Prescription dispensed",
    "HealthPlus, Ikeja · Pharmacist T. Aina",
    "Ferrous sulfate 200 mg · 30 tablets",
  ],
  [
    "29 Sep 2026",
    icons.lab,
    "Full blood count",
    "SYNLAB Ikeja · Report SL-290926-184",
    "Haemoglobin 10.2 g/dL · Lab reference: 12.0–15.5 g/dL",
  ],
  [
    "28 Sep 2026",
    icons.fileHeart,
    "Prescription issued",
    "Dr Amaka Bello · Lagoon Hospital",
    "Ferrous sulfate 200 mg once daily · Amlodipine 5 mg continued",
  ],
  [
    "28 Sep 2026",
    icons.stethoscope,
    "Follow-up consultation",
    "Dr Amaka Bello · Lagoon Hospital",
    "Hypertension review · Full blood count requested",
  ],
  [
    "18 Jun 2026",
    icons.syringe,
    "Tetanus booster",
    "Lagoon Hospital · Nurse E. Adeyemi",
    "Td vaccine · Dose recorded",
  ],
] as const;

export default function TimelineScreen() {
  const [activeFilter, setActiveFilter] = useState("All records");

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Timeline" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-1">
              {["All records", "2026", "Filters"].map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`rounded-full border px-3 py-2 ${
                    activeFilter === item
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={item}
                  onPress={() => setActiveFilter(item)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      activeFilter === item ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Text className="text-xs leading-[1.45] text-[#53657c]">
            Filter by provider, doctor, lab, pharmacy, medicine, diagnosis,
            date or record type.
          </Text>

          <View className="gap-3">
            {timelineItems.map(([date, icon, title, source, detail], index) => (
              <View className="flex-row gap-2" key={`${date}-${title}`}>
                <View className="w-[30px] items-center">
                  <View className="size-7 items-center justify-center rounded-full bg-[#edf2fa]">
                    <Icon size={15} src={icon} />
                  </View>
                  {index < timelineItems.length - 1 && (
                    <View className="mt-1 w-0.5 flex-1 bg-[#dae2ee]" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="mb-2 text-[11px] font-semibold text-[#53657c]">
                    {date}
                  </Text>
                  <Card
                    className="mb-1 p-4"
                    onPress={
                      title === "Full blood count"
                        ? () => router.push("/result")
                        : undefined
                    }
                  >
                    <Text className="text-sm font-semibold text-[#031f50]">
                      {title}
                    </Text>
                    <Text className="mt-2 text-xs text-[#53657c]">
                      {source}
                    </Text>
                    <Text className="mt-3 text-xs leading-[1.45] text-[#173b71]">
                      {detail}
                    </Text>
                    <View className="mt-3">
                      <Badge>Verified provider</Badge>
                    </View>
                  </Card>
                </View>
              </View>
            ))}
          </View>

          <Guidance title="Your own symptoms and measurements are Patient Added">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              They never silently rewrite this history.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
