import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Icon,
  Row,
  ScreenStack,
  SectionTitle,
} from "../../components/common";
import { icons } from "../../constants/icons";
import { useWelli } from "../../state/WelliContext";
import { useRecords } from "../../hooks/useRecords";
import {
  fetchAppointments,
  nextAppointment,
  type Appointment,
} from "../../services/appointmentService";
import { labDate, labValue } from "../../services/labService";
import {
  clockLabel,
  dosageText,
  isCurrent,
  nextDose,
} from "../../services/medicationService";

const quickActions = [
  [icons.calendar, "Appointments", "/(tabs)/care-discovery"],
  [icons.send, "Share record", "/(tabs)/consent-expanded"],
  [icons.scan, "Upload", "/upload-review"],
  [icons.lab, "Lab results", "/reports"],
] as const;

function greeting(name: string | null): string {
  const h = new Date().getHours();
  const part = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${part}, ${name}` : part;
}

function appointmentWhen(a: Appointment): string {
  const d = new Date(a.scheduledFor);
  const day = d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  return a.timeSlot ? `${day} · ${a.timeSlot}` : day;
}

export default function HomeScreen() {
  const { user } = useWelli();
  const { labs, medications, loadedAt, refreshing, refresh } = useRecords();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [apptState, setApptState] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  const loadAppointments = useCallback(async () => {
    try {
      setAppointment(nextAppointment(await fetchAppointments()));
      setApptState("ready");
    } catch {
      setApptState("error");
    }
  }, []);

  // Tabs stay mounted, so refetch whenever home regains focus (for example
  // after booking or cancelling).
  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? null;
  const allergies = user?.allergies?.trim();
  const hasAllergies = !!allergies && !/^(none|nil|nka|nkda|no)$/i.test(allergies);
  const dose = nextDose(medications);
  const currentMeds = medications.filter(isCurrent);
  const latestLab = labs[0] ?? null;

  return (
    <View className="flex-1 bg-white">
      <Header
        onRightAction={() =>
          Alert.alert("Notifications", "Notifications are not available yet.")
        }
        rightAction="notifications"
        title={greeting(firstName)}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              refresh();
              loadAppointments();
            }}
            refreshing={refreshing}
          />
        }
      >
        <ScreenStack>
          <Card className="border-[#031f50] bg-[#031f50] p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] font-medium tracking-[0.08em] text-[#e0e9f8]">
                YOUR WELLIID
              </Text>
              <Icon size={28} src={icons.fingerprint} />
            </View>
            <Text className="mt-5 text-[27px] font-semibold tracking-[0.02em] text-white">
              {user?.wrId ?? user?.memberId ?? "—"}
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#e0e9f8]">
              One patient. One trusted record.{"\n"}Accessible when it
              matters.
            </Text>
            {loadedAt && (
              <View className="mt-5 flex-row flex-wrap gap-2">
                <Text className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                  Synced{" "}
                  {loadedAt.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
            )}
          </Card>

          <View className="flex-row justify-between">
            {quickActions.map(([icon, label, target]) => (
              <Pressable
                accessibilityRole="button"
                className="items-center gap-2 active:opacity-70"
                key={label}
                onPress={() => router.push(target)}
              >
                <View className="size-12 items-center justify-center rounded-2xl bg-[#edf2fa]">
                  <Icon size={23} src={icon} />
                </View>
                <Text className="text-center text-[10px] font-semibold leading-tight text-[#031f50]">
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Card onPress={() => router.push("/(tabs)/care-discovery")}>
            <Row
              detail="Participating providers, appointments, labs and pharmacies"
              icon={icons.stethoscope}
              title="Find care near you"
            />
          </Card>

          <SectionTitle>Your health at a glance</SectionTitle>
          <Card>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-[#031f50]">
                  {user?.bloodType ?? "—"}
                </Text>
                <Text className="text-xs text-[#53657c]">Blood group</Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-[#031f50]">
                  {user?.genotype ?? "—"}
                </Text>
                <Text className="text-xs text-[#53657c]">Genotype</Text>
              </View>
            </View>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {hasAllergies ? (
                <Badge tone="red">Allergies: {allergies}</Badge>
              ) : (
                <Badge>No allergies recorded</Badge>
              )}
            </View>
          </Card>

          <SectionTitle action="View timeline" onAction={() => router.push("/timeline")}>
            Next in your care
          </SectionTitle>
          <Card className="gap-4">
            {appointment ? (
              <Row
                detail={[appointmentWhen(appointment), appointment.facilityName]
                  .filter(Boolean)
                  .join(" · ")}
                icon={icons.calendar}
                onPress={() =>
                  router.push({
                    pathname: "/booking-confirmed",
                    params: { id: appointment.id },
                  })
                }
                title={
                  appointment.status === "requested"
                    ? "Appointment requested"
                    : "Upcoming appointment"
                }
              />
            ) : (
              <Row
                detail={
                  apptState === "error"
                    ? "Could not load appointments. Pull down to retry."
                    : "Book a visit with a participating provider"
                }
                icon={icons.calendar}
                onPress={() => router.push("/(tabs)/care-discovery")}
                title="No upcoming appointments"
              />
            )}
            <View className="h-px bg-[#dae2ee]" />
            {dose ? (
              <Row
                detail={`Next dose today at ${clockLabel(dose.time)}`}
                icon={icons.pill}
                onPress={() => router.push("/medications")}
                title={[dose.med.medicationName, dosageText(dose.med)]
                  .filter(Boolean)
                  .join(" · ")}
              />
            ) : (
              <Row
                detail={
                  currentMeds.length > 0
                    ? `${currentMeds.length} current ${currentMeds.length === 1 ? "medication" : "medications"}`
                    : "Nothing recorded yet"
                }
                icon={icons.pill}
                onPress={() => router.push("/medications")}
                title="Medications"
              />
            )}
          </Card>

          <SectionTitle action="View all" onAction={() => router.push("/reports")}>
            Recent record activity
          </SectionTitle>
          {latestLab ? (
            <Card
              onPress={() =>
                router.push({ pathname: "/result", params: { id: latestLab._id } })
              }
            >
              <Row
                detail={[labDate(latestLab), latestLab.organizationName]
                  .filter(Boolean)
                  .join(" · ")}
                icon={icons.lab}
                title={`${latestLab.testName} · ${labValue(latestLab)}`}
              />
              <View className="mt-3">
                <Badge>
                  {latestLab.verificationStatus === "verified"
                    ? "Verified provider"
                    : "Provider submitted"}
                </Badge>
              </View>
            </Card>
          ) : (
            <Card>
              <Text className="text-sm text-[#53657c]">
                No results yet. Results your provider submits appear here.
              </Text>
            </Card>
          )}
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
