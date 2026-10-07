import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { Header } from "../../components/navigation/Header";
import { Badge, Card, Icon, Row, ScreenStack, SectionTitle } from "../../components/common";
import { icons } from "../../constants/icons";
import { useWelli } from "../../state/WelliContext";

const quickActions = [
  [icons.calendar, "Appointments", "/booking-time"],
  [icons.send, "Share record", "/(tabs)/consent-expanded"],
  [icons.scan, "Upload", "/(tabs)/records"],
  [icons.lab, "Lab results", "/reports"],
] as const;

export default function HomeScreen() {
  const { careStage } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header
        onRightAction={() =>
          Alert.alert(
            "Notification Center",
            "2 new alerts from Dr. Bello and SYNLAB"
          )
        }
        rightAction="notifications"
        title="Good morning, Adaeze"
      />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <Card className="border-[#031f50] bg-[#031f50] p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-[11px] font-medium tracking-[0.08em] text-[#e0e9f8]">
                YOUR WELLIID
              </Text>
              <Icon size={28} src={icons.fingerprint} />
            </View>
            <Text className="mt-5 text-[27px] font-semibold tracking-[0.02em] text-white">
              WR-4821-0936
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#e0e9f8]">
              One patient. One trusted record.{"\n"}Accessible when it
              matters.
            </Text>
            <View className="mt-5 flex-row flex-wrap gap-2">
              <Text className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                Synced today, 08:42
              </Text>
              <Text className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold text-white">
                Available offline
              </Text>
            </View>
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
                <Text className="text-2xl font-bold text-[#031f50]">O+</Text>
                <Text className="text-xs text-[#53657c]">Blood group</Text>
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-bold text-[#031f50]">AA</Text>
                <Text className="text-xs text-[#53657c]">Genotype</Text>
              </View>
            </View>
            <View className="mt-3 flex-row flex-wrap gap-2">
              <Badge tone="red">Penicillin allergy</Badge>
              <Badge>Hypertension</Badge>
            </View>
            <Text className="mt-3 text-xs text-[#53657c]">
              Alert: penicillin caused a rash · Provider confirmed
            </Text>
          </Card>

          <SectionTitle action="View timeline" onAction={() => router.push("/timeline")}>
            Next in your care
          </SectionTitle>
          <Card className="gap-4">
            <Row
              detail={
                careStage === "checkedIn"
                  ? "Checked in · Waiting for triage at Lagoon Hospital"
                  : "Mon, 5 Oct · 10:30 AM · Lagoon Hospital, Ikeja"
              }
              icon={icons.calendar}
              onPress={() =>
                router.push(
                  careStage === "checkedIn"
                    ? "/care-journey"
                    : careStage === "booked"
                      ? "/booking-confirmed"
                      : "/booking-time"
                )
              }
              title={
                careStage === "checkedIn"
                  ? "Visit with Dr Amaka Bello"
                  : careStage === "booked"
                    ? "Booked · Follow-up with Dr Amaka Bello"
                    : "Follow-up with Dr Amaka Bello"
              }
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Next dose today at 8:00 PM · After food"
              icon={icons.pill}
              onPress={() => router.push("/medications")}
              title="Ferrous sulfate · 200 mg"
            />
          </Card>

          <SectionTitle action="View all" onAction={() => router.push("/reports")}>
            Recent record activity
          </SectionTitle>
          <Card onPress={() => router.push("/reports")}>
            <Row
              detail="SYNLAB Ikeja · 29 Sep 2026"
              icon={icons.lab}
              title="Full blood count added"
            />
            <View className="mt-3 flex-row items-center justify-between gap-2">
              <Badge>Verified provider</Badge>
              <Text className="text-[11px] text-[#53657c]">
                Shared with Dr Bello · 24 hours
              </Text>
            </View>
          </Card>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
