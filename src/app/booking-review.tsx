import React from "react";
import { View, Text, ScrollView } from "react-native";
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
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function BookingReviewScreen() {
  const { confirmBooking } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Book an appointment" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Check your visit and costs before confirming."
            eyebrow="BOOKING · REVIEW"
            title="Review your booking"
          />
          <Card>
            <Row
              detail="Internal medicine · Verified provider"
              icon={icons.stethoscope}
              title="Dr Amaka Bello"
            />
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Mon, 5 Oct 2026 · 10:30 AM · 30 min
            </Text>
            <Text className="mt-4 text-sm leading-[1.45] text-[#53657c]">
              Lagoon Hospital, Ikeja{"\n"}
              3 Obafemi Awolowo Way{"\n"}
              Reason: hypertension follow-up
            </Text>
            <Text className="mt-4 text-xs text-[#53657c]">
              Time zone: Africa/Lagos
            </Text>
          </Card>
          <SectionTitle>Coverage & registration</SectionTitle>
          <Card>
            <Badge>Consultation authorized</Badge>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Reliance HMO · RL-AU-51073
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              Member RL-209184 · Active through 31 Dec 2026. Tests may need
              separate authorization.
            </Text>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              ₦5,000 registration fee
            </Text>
            <Text className="mt-2 text-xs text-[#53657c]">
              Not covered by HMO · Separate bill LG-B051026-073.
            </Text>
          </Card>
          <Guidance title="Booking information only">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Send your name, WelliID, verified contact, selected
              clinician/time, reason and HMO authorization. No lab reports
              are included.
            </Text>
          </Guidance>
          <Guidance title="Sharing is a separate choice">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Confirming this booking does not grant clinical record access.
            </Text>
          </Guidance>
          <PrimaryButton onPress={confirmBooking}>
            Confirm booking
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/booking-time")}>
            Change visit details
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
