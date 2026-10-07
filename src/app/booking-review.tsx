import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import {
  createAppointmentRequest,
  formatAppointmentDate,
} from "../services/appointmentService";
import { hapticFeedback } from "../utils/haptics";

export default function BookingReviewScreen() {
  const p = useLocalSearchParams<{
    facilityId?: string;
    facilityName?: string;
    facilityAddress?: string;
    date?: string;
    timeSlot?: string;
    reason?: string;
  }>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = !!(p.facilityName && p.date && p.timeSlot);

  const handleConfirm = async () => {
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const appointment = await createAppointmentRequest({
        facilityId: p.facilityId || undefined,
        facilityName: p.facilityName!,
        facilityAddress: p.facilityAddress || undefined,
        date: p.date!,
        timeSlot: p.timeSlot!,
        reason: p.reason || undefined,
      });
      hapticFeedback.success();
      router.replace({
        pathname: "/booking-confirmed",
        params: { id: appointment.id },
      });
    } catch (err) {
      hapticFeedback.error();
      setError(
        err instanceof Error ? err.message : "Could not send the request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Book an appointment" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Check the details before you send the request."
            eyebrow="BOOKING · REVIEW"
            title="Review your request"
          />
          {!ready ? (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Nothing to review
              </Text>
              <View className="mt-4">
                <PrimaryButton
                  onPress={() => router.replace("/(tabs)/care-discovery")}
                >
                  Find care
                </PrimaryButton>
              </View>
            </Card>
          ) : (
            <Card>
              <Row
                detail={p.facilityAddress || "Participating provider"}
                icon={icons.stethoscope}
                title={p.facilityName!}
              />
              <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                {formatAppointmentDate(p.date!)}
              </Text>
              <Text className="mt-1 text-sm text-[#031f50]">{p.timeSlot}</Text>
              {p.reason ? (
                <Text className="mt-4 text-sm leading-[1.45] text-[#53657c]">
                  Reason: {p.reason}
                </Text>
              ) : null}
            </Card>
          )}

          <Guidance title="What the provider receives">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Your name, WelliID, contact details, the day and time window
              you chose, and your reason. No health records are included.
            </Text>
          </Guidance>
          <Guidance title="Sharing is a separate choice">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Sending this request does not give the provider access to your
              records.
            </Text>
          </Guidance>

          {error && <Text className="text-xs text-[#af4540]">{error}</Text>}
          <PrimaryButton disabled={!ready || submitting} onPress={handleConfirm}>
            {submitting ? "Sending request..." : "Send request"}
          </PrimaryButton>
          <SecondaryButton disabled={submitting} onPress={() => router.back()}>
            Change visit details
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
