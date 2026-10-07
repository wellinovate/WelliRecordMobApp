import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

const DAYS = [
  ["Mon", "05"],
  ["Tue", "06"],
  ["Wed", "07"],
  ["Thu", "08"],
];

const TIMES = ["9:30 AM", "10:30 AM", "11:30 AM"];

export default function BookingTimeScreen() {
  const [date, setDate] = useState("05");
  const [time, setTime] = useState("10:30 AM");

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Book an appointment" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="A 30-minute consultation, in person."
            eyebrow="BOOKING · SELECT A TIME"
            title="Choose your visit time"
          />
          <Card>
            <Row
              detail="Internal medicine · Lagoon Hospital, Ikeja"
              icon={icons.stethoscope}
              title="Dr Amaka Bello"
            />
            <View className="mt-3">
              <Badge>Verified provider</Badge>
            </View>
            <Text className="mt-4 text-sm text-[#53657c]">
              3 Obafemi Awolowo Way, Ikeja, Lagos
            </Text>
            <Text className="mt-3 text-xs text-[#53657c]">
              Reliance accepted · Service eligibility and authorization
              checked at review.
            </Text>
          </Card>
          <View>
            <Text className="text-lg font-bold text-[#031f50]">
              October 2026
            </Text>
            <View className="mt-3 flex-row gap-2">
              {DAYS.map(([day, number]) => (
                <Pressable
                  accessibilityRole="button"
                  className={`flex-1 rounded-[14px] py-3 ${
                    date === number ? "bg-[#031f50]" : "bg-[#edf2fa]"
                  }`}
                  key={number}
                  onPress={() => setDate(number)}
                >
                  <Text
                    className={`text-center text-xs ${
                      date === number ? "text-white" : "text-[#53657c]"
                    }`}
                  >
                    {day}
                  </Text>
                  <Text
                    className={`mt-1 text-center text-2xl font-bold ${
                      date === number ? "text-white" : "text-[#53657c]"
                    }`}
                  >
                    {number}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              Mon, {date} Oct · Africa/Lagos
            </Text>
            <View className="mt-3 flex-row gap-2">
              {TIMES.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`h-12 flex-1 items-center justify-center rounded-xl border ${
                    time === item
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={item}
                  onPress={() => setTime(item)}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      time === item ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {time === item ? "✓ " : ""}
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Guidance title={`Selected · ${date} Oct at ${time}`}>
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Times shown are a sample of provider availability. The slot is
              not reserved until booking is confirmed.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/booking-review")}>
            Review booking
          </PrimaryButton>
          <SecondaryButton
            onPress={() =>
              Alert.alert("Showing next available week: 12–16 Oct")
            }
          >
            See other dates
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
