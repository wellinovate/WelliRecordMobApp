import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
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
import {
  cancelAppointment,
  fetchAppointments,
  formatAppointmentDate,
  nextAppointment,
  statusLabel,
  type Appointment,
} from "../services/appointmentService";
import { hapticFeedback } from "../utils/haptics";

export default function BookingConfirmedScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchAppointments();
      // Links without an id open the next upcoming appointment.
      setAppointment(
        id ? list.find((a) => a.id === id) ?? null : nextAppointment(list)
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load the appointment."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const doCancel = async () => {
    if (!appointment) return;
    setCancelling(true);
    try {
      setAppointment(await cancelAppointment(appointment.id));
      hapticFeedback.warning();
    } catch (err) {
      Alert.alert(
        "Could not cancel",
        err instanceof Error ? err.message : "Try again."
      );
    } finally {
      setCancelling(false);
    }
  };

  const confirmCancel = () =>
    Alert.alert(
      "Cancel this appointment?",
      "The provider will no longer expect you.",
      [
        { text: "Keep it", style: "cancel" },
        { text: "Cancel appointment", style: "destructive", onPress: doCancel },
      ]
    );

  const status = appointment ? statusLabel(appointment.status) : null;
  const cancelled = appointment?.status === "cancelled";
  const cancellable =
    appointment && ["requested", "confirmed"].includes(appointment.status);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Appointment" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
            </View>
          )}

          {!loading && (error || !appointment) && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                {error ? "Could not load the appointment" : "No appointment found"}
              </Text>
              {error && (
                <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                  {error}
                </Text>
              )}
              <View className="mt-4">
                <SecondaryButton
                  onPress={error ? load : () => router.replace("/(tabs)/care-discovery")}
                >
                  {error ? "Try again" : "Find care"}
                </SecondaryButton>
              </View>
            </Card>
          )}

          {!loading && appointment && status && (
            <>
              <ScreenIntroHeader
                copy={
                  cancelled
                    ? "This appointment was cancelled."
                    : appointment.status === "requested"
                      ? "The provider will confirm the exact time."
                      : "Keep your appointment details close."
                }
                eyebrow="APPOINTMENT"
                title={
                  cancelled
                    ? "Appointment cancelled"
                    : appointment.status === "requested"
                      ? "Request sent"
                      : "Your visit is booked"
                }
              />
              <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
                <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
                  <Icon size={28} src={icons.calendarCheck} />
                </View>
                <View className="mt-4">
                  <Badge tone={status.tone}>{status.label}</Badge>
                </View>
              </View>
              <Card className="border-[#031f50] bg-[#031f50]">
                <Text className="text-xl font-bold text-white">
                  {formatAppointmentDate(appointment.scheduledFor)}
                </Text>
                {appointment.timeSlot ? (
                  <Text className="mt-3 text-sm text-[#e0e9f8]">
                    {appointment.timeSlot}
                  </Text>
                ) : null}
                <Text className="mt-4 text-sm font-semibold text-white">
                  {appointment.facilityName}
                </Text>
                {appointment.facilityAddress ? (
                  <Text className="mt-2 text-sm text-[#e0e9f8]">
                    {appointment.facilityAddress}
                  </Text>
                ) : null}
                {appointment.reason ? (
                  <Text className="mt-4 text-sm text-[#e0e9f8]">
                    Reason: {appointment.reason}
                  </Text>
                ) : null}
              </Card>

              <Guidance title="Booking does not share your records">
                <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                  Review sharing separately if you want the provider to see
                  your records during the visit.
                </Text>
              </Guidance>

              {!cancelled && (
                <>
                  <PrimaryButton onPress={() => router.push("/visit-prep")}>
                    Prepare for your visit
                  </PrimaryButton>
                  {appointment.facilityAddress ? (
                    <Card
                      onPress={() =>
                        Linking.openURL(
                          `https://maps.google.com/?q=${encodeURIComponent(
                            `${appointment.facilityName} ${appointment.facilityAddress}`
                          )}`
                        ).catch(() => Alert.alert("Could not open maps"))
                      }
                    >
                      <Row
                        detail={appointment.facilityAddress}
                        icon={icons.mapPin}
                        title="Get directions"
                      />
                    </Card>
                  ) : null}
                </>
              )}
              {cancellable && (
                <SecondaryButton disabled={cancelling} onPress={confirmCancel}>
                  {cancelling ? "Cancelling..." : "Cancel appointment"}
                </SecondaryButton>
              )}
              <SecondaryButton onPress={() => router.replace("/(tabs)/home")}>
                Back to home
              </SecondaryButton>
            </>
          )}
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
