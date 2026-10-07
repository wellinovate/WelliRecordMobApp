import React from "react";
import { View, Text, ScrollView, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  Row,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

const HOSPITAL_ADDRESS = "3 Obafemi Awolowo Way, Ikeja, Lagos";

export default function BookingConfirmedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Appointment" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Keep your appointment details close."
            eyebrow="BOOKING OUTCOME · BEFORE THE VISIT"
            title="Your visit is booked"
          />
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.calendarCheck} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Booking confirmed
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              Appointment LG-051026-073
            </Text>
          </View>
          <Card className="border-[#031f50] bg-[#031f50]">
            <Text className="text-xl font-bold text-white">
              Mon, 5 Oct 2026 · 10:30 AM
            </Text>
            <Text className="mt-4 text-sm text-[#e0e9f8]">
              30 min · Africa/Lagos
            </Text>
            <Text className="mt-4 text-sm font-semibold text-white">
              Dr Amaka Bello · Internal medicine
            </Text>
            <Text className="mt-4 text-sm text-[#e0e9f8]">
              Lagoon Hospital, Ikeja{"\n"}3 Obafemi Awolowo Way
            </Text>
          </Card>
          <Guidance title="Record access ends before this visit" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              C-1031 ends 4 Oct at 9:41 AM. Booking has not extended access.
              Review sharing separately if you want access during the visit.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/visit-prep")}>
            Prepare for your visit
          </PrimaryButton>
          <Card
            onPress={() =>
              Linking.openURL(
                `https://maps.google.com/?q=${encodeURIComponent(HOSPITAL_ADDRESS)}`
              ).catch(() => Alert.alert("Could not open maps"))
            }
          >
            <Row
              detail="Lagoon Hospital, Ikeja"
              icon={icons.mapPin}
              title="Get directions"
            />
          </Card>
          <Card>
            <Row
              detail="1 day before · No health details on lock screen"
              icon={icons.bell}
              title="In-app reminder · On"
            />
          </Card>
          <SecondaryButton onPress={() => router.push("/booking-time")}>
            Reschedule
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
