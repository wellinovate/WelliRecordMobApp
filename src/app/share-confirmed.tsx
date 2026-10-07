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
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

export default function ShareConfirmedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Consent confirmed" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.success} />
            </View>
            <Text className="mt-3 text-center text-[22px] font-bold leading-[1.3] text-[#031f50]">
              Shared for 24 hours
            </Text>
            <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
              You continued with your selected duration. Access has not been
              extended.
            </Text>
          </View>

          <Card>
            <Badge>Active · Consent C-1031</Badge>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Treatment · Follow-up review
            </Text>
            <Text className="mt-3 text-sm leading-[1.45] text-[#173b71]">
              Laboratory{"\n"}
              Medications & prescriptions{"\n"}
              Medical consultations only
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              Granted 3 Oct 2026, 9:41 AM{"\n"}
              Expires 4 Oct 2026, 9:41 AM · Africa/Lagos
            </Text>
          </Card>

          <Guidance title="This does not cover your 5 Oct visit" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Your 10:30 AM appointment is after expiry. Change the duration
              only if you choose to.
            </Text>
          </Guidance>

          <PrimaryButton onPress={() => router.push("/(tabs)/consent-expanded")}>
            Manage duration
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/consent-expanded")}>
            View consent
          </SecondaryButton>

          <Text className="text-center text-xs text-[#53657c]">
            All accesses are logged. You can revoke eligible access in
            Consent Center.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
