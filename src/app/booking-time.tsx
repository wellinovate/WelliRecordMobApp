import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  LabeledInput,
  PrimaryButton,
  Row,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

const TIME_SLOTS = [
  "Morning (8 AM–12 PM)",
  "Afternoon (12–4 PM)",
  "Evening (4–7 PM)",
];

const DAY_COUNT = 14;

export default function BookingTimeScreen() {
  const { facilityId, facilityName, facilityAddress } = useLocalSearchParams<{
    facilityId?: string;
    facilityName?: string;
    facilityAddress?: string;
  }>();

  // Built once: today plus the next 13 days, at local noon so the date part
  // survives the trip to the server regardless of time zone.
  const days = useMemo(() => {
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    return Array.from({ length: DAY_COUNT }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [dayIndex, setDayIndex] = useState(1);
  const [slot, setSlot] = useState(TIME_SLOTS[0]);
  const [reason, setReason] = useState("");

  if (!facilityName) {
    return (
      <View className="flex-1 bg-white">
        <Header canGoBack title="Book an appointment" />
        <ScrollView contentContainerClassName="px-[22px] pb-10 pt-5">
          <ScreenStack>
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Choose a provider first
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                Pick a hospital or clinic from Find care, then choose a time.
              </Text>
              <View className="mt-4">
                <PrimaryButton
                  onPress={() => router.replace("/(tabs)/care-discovery")}
                >
                  Find care
                </PrimaryButton>
              </View>
            </Card>
          </ScreenStack>
        </ScrollView>
      </View>
    );
  }

  const chosen = days[dayIndex];
  const chosenLabel = chosen.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Book an appointment" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Choose the day and time of day that suits you. The provider confirms the exact time."
            eyebrow="BOOKING · SELECT A TIME"
            title="Choose your visit time"
          />
          <Card>
            <Row
              detail={facilityAddress || "Participating provider"}
              icon={icons.stethoscope}
              title={facilityName}
            />
          </Card>

          <View>
            <Text className="text-sm font-semibold text-[#031f50]">Day</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-3"
            >
              <View className="flex-row gap-2 pb-1">
                {days.map((d, i) => {
                  const active = i === dayIndex;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      className={`w-[64px] rounded-[14px] py-3 ${
                        active ? "bg-[#031f50]" : "bg-[#edf2fa]"
                      }`}
                      key={d.toISOString()}
                      onPress={() => setDayIndex(i)}
                    >
                      <Text
                        className={`text-center text-xs ${
                          active ? "text-white" : "text-[#53657c]"
                        }`}
                      >
                        {d.toLocaleDateString("en-GB", { weekday: "short" })}
                      </Text>
                      <Text
                        className={`mt-1 text-center text-2xl font-bold ${
                          active ? "text-white" : "text-[#53657c]"
                        }`}
                      >
                        {d.getDate()}
                      </Text>
                      <Text
                        className={`text-center text-[10px] ${
                          active ? "text-white" : "text-[#53657c]"
                        }`}
                      >
                        {d.toLocaleDateString("en-GB", { month: "short" })}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              Preferred time
            </Text>
            <View className="mt-3 gap-2">
              {TIME_SLOTS.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`h-12 items-center justify-center rounded-xl border ${
                    slot === item
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={item}
                  onPress={() => setSlot(item)}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      slot === item ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {slot === item ? "✓ " : ""}
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <LabeledInput
            helper="Optional. Shared with the provider with your request."
            label="Reason for visit"
            maxLength={500}
            multiline
            onChangeText={setReason}
            placeholder="For example: follow-up, blood pressure check"
            value={reason}
          />

          <Guidance title={`Selected · ${chosenLabel}, ${slot}`}>
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              This sends a request. Your slot is not reserved until the
              provider confirms it.
            </Text>
          </Guidance>

          <PrimaryButton
            onPress={() =>
              router.push({
                pathname: "/booking-review",
                params: {
                  facilityId: facilityId ?? "",
                  facilityName,
                  facilityAddress: facilityAddress ?? "",
                  date: chosen.toISOString(),
                  timeSlot: slot,
                  reason: reason.trim(),
                },
              })
            }
          >
            Review request
          </PrimaryButton>
          <SecondaryButton onPress={() => router.back()}>
            Choose a different provider
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
