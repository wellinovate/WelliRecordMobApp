import React from "react";
import { View, Text, Pressable, ScrollView, Alert, Linking } from "react-native";
import { Header } from "../components/navigation/Header";
import { Badge, Card, Guidance, Row, ScreenStack } from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function EmergencyInfoScreen() {
  const { endEmergency } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Emergency information" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="rounded-[20px] bg-[#af4540] p-5 shadow-lg">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-white">
              EMERGENCY INFORMATION
            </Text>
            <Text className="mt-2 text-xl font-bold text-white">
              "I'm in an emergency" is active
            </Text>
            <Text className="mt-2 text-xs text-[#faedea]">
              Started 3 Oct at 9:40 AM · Essentials only{"\n"}
              Emergency sharing ends at 9:50 AM.
            </Text>
          </View>

          <View className="flex-row gap-3">
            <Card className="flex-1 items-center">
              <Text className="text-xs text-[#53657c]">Blood group</Text>
              <Text className="mt-2 text-2xl font-bold text-[#031f50]">
                O+
              </Text>
            </Card>
            <Card className="flex-1 items-center">
              <Text className="text-xs text-[#53657c]">Genotype</Text>
              <Text className="mt-2 text-2xl font-bold text-[#031f50]">
                AA
              </Text>
            </Card>
          </View>

          <Card className="border-[#faedea] bg-[#faedea]">
            <Text className="text-[10px] font-semibold text-[#af4540]">
              ALLERGY ALERT
            </Text>
            <Text className="mt-2 text-lg font-bold text-[#af4540]">
              Penicillin
            </Text>
            <Text className="mt-2 text-xs text-[#936020]">
              Recorded reaction: rash · Provider confirmed
            </Text>
          </Card>

          <Card>
            <Text className="text-[10px] font-semibold text-[#53657c]">
              IMPORTANT CONDITION & MEDICATION
            </Text>
            <Text className="mt-3 text-sm font-semibold text-[#031f50]">
              Hypertension
            </Text>
            <Text className="mt-2 text-sm text-[#173b71]">
              Amlodipine 5 mg · Once daily
            </Text>
            <Text className="mt-2 text-xs text-[#53657c]">
              Source: Lagoon Hospital · Dr Bello · 28 Sep 2026
            </Text>
          </Card>

          <Card
            onPress={() =>
              Alert.alert(
                "Call Chidi Okafor?",
                "+234 803 555 0142",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Call",
                    onPress: () => Linking.openURL("tel:+2348035550142"),
                  },
                ]
              )
            }
          >
            <Row
              detail="+234 803 555 0142 · Tap to call"
              icon={icons.emergencyPhone}
              title="Chidi Okafor · Husband"
            />
            <View className="mt-3">
              <Badge>Selected contact notified · 9:40 AM</Badge>
            </View>
            <Text className="mt-3 text-xs text-[#53657c]">
              Shared with Chidi: identity, O+/AA, allergy, hypertension and
              amlodipine. Grant E-1032 · 10 minutes · Logged.
            </Text>
          </Card>

          <Guidance title="Location sharing is off">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Your location was not sent. Share only if you choose.
            </Text>
          </Guidance>
          <Guidance title="This does not dispatch emergency services" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Contact notification does not guarantee a response. Seek local
              emergency help directly.
            </Text>
          </Guidance>

          <Pressable
            accessibilityRole="button"
            className="min-h-[50px] w-full items-center justify-center rounded-[14px] bg-[#af4540] px-4 active:opacity-80"
            onPress={endEmergency}
          >
            <Text className="text-sm font-semibold text-white">
              End emergency sharing
            </Text>
          </Pressable>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
