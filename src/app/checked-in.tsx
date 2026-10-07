import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
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
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

export default function CheckedInScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Visit check-in" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Lagoon Hospital, Ikeja · Keep your phone with you."
            eyebrow="ARRIVAL OUTCOME · 5 OCT 2026, 9:20 AM"
            title="You're checked in"
          />
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.clipboard} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Registration confirmed
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              Checked in 5 Oct 2026 at 9:20 AM · Africa/Lagos
            </Text>
          </View>
          <Card>
            <Text className="text-sm font-semibold text-[#031f50]">
              Adaeze Okafor · WR-4821-0936
            </Text>
            <Text className="mt-4 text-sm leading-[1.45] text-[#53657c]">
              Visit LG-051026-073{"\n"}
              Dr Amaka Bello · 10:30 AM appointment
            </Text>
            <View className="mt-4">
              <Badge>Facility-confirmed check-in</Badge>
            </View>
          </Card>
          <SectionTitle>Next in your care</SectionTitle>
          <Card className="gap-4">
            <Row
              detail="WelliID matched · 9:20 AM"
              icon={icons.success}
              title="Registration · Complete"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Not started yet. Reception will guide you."
              icon={icons.history}
              title="Triage · Next"
            />
          </Card>
          <Guidance title="Please stay near the waiting area">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Visit timing may change. Ask reception if you need help or if
              your symptoms worsen.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/care-journey")}>
            View care journey
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/booking-confirmed")}>
            View appointment details
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
