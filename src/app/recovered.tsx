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
} from "../components/common";
import { icons } from "../constants/icons";

export default function RecoveredScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Account recovery" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Recovery verified. Your new passkey is configured."
            eyebrow="RECOVERY OUTCOME · AFTER VERIFIED RECOVERY"
            title="Your account is secured"
          />
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.key} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Access recovered safely
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              Adaeze Okafor · WR-4821-0936
            </Text>
          </View>
          <Card>
            <Badge>New passkey configured</Badge>
            <View className="mt-4">
              <Row
                detail="Added after verified recovery · 3 Oct 2026"
                icon={icons.key}
                title="Passkey on this device"
              />
            </View>
            <Text className="mt-3 text-xs text-[#53657c]">
              Use device screen lock or biometrics. Review your backup
              verified contact too.
            </Text>
          </Card>
          <Guidance title="Your identity and records remain intact">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Your WelliID and server-held records are unchanged. Recovery
              does not delete medical data or revoke clinical consent.
            </Text>
          </Guidance>
          <Card onPress={() => router.push("/lost-phone")}>
            <Row
              detail="Check iPhone 14 and Chrome on Windows."
              icon={icons.monitor}
              title="Review prior sessions"
            />
          </Card>
          <PrimaryButton onPress={() => router.push("/lost-phone")}>
            Review devices & sessions
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/lost-phone")}>
            Lost-phone protection
          </SecondaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/profile")}>
            Return to my account
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
