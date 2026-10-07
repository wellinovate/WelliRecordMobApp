import React from "react";
import { View, Text, ScrollView, Alert } from "react-native";
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
} from "../components/common";
import { icons } from "../constants/icons";

export default function LostPhoneScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Security" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="End device access without deleting your health record."
            eyebrow="SECURITY · SEQUENTIAL CONFIRMATION STATES"
            title="Protect a lost phone"
          />
          <Badge tone="amber">Before confirmation · Review</Badge>
          <Card>
            <Text className="text-sm font-semibold text-[#031f50]">
              Log out all devices / freeze sessions
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              All current sessions will end, including this one. Every
              device must sign in and verify again before accessing your
              account.
            </Text>
            <View className="mt-4">
              <Row
                detail="iPhone 14 · Chrome on Windows · Recovery device"
                icon={icons.smartphone}
                title="Devices in this request"
              />
            </View>
          </Card>
          <Guidance title="Authentication and connection required" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Confirm your identity first. Sessions end only when the server
              confirms online. This is not a remote wipe of the lost phone.
            </Text>
          </Guidance>
          <PrimaryButton danger onPress={() => router.push("/verify-recovery")}>
            Authenticate & confirm logout of all devices
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/profile")}>
            Cancel · Keep sessions
          </SecondaryButton>
          <Text className="text-xs leading-[1.45] text-[#53657c]">
            Server-held records and WelliID remain. Clinical consent is
            unchanged.
          </Text>
          <View className="h-px bg-[#dae2ee]" />
          <Card className="border-[#edf2fa] bg-[#edf2fa]">
            <Text className="text-[10px] font-semibold text-[#173b71]">
              AFTER CONFIRMATION · SEPARATE LATER STATE
            </Text>
            <Text className="mt-3 text-lg font-bold text-[#031f50]">
              ✓ Sessions ended
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#173b71]">
              Authenticated request confirmed online · 3 Oct 2026, 10:30 AM
              · Africa/Lagos. All prior sessions ended.
            </Text>
            <View className="mt-4">
              <PrimaryButton onPress={() => router.push("/recover-account")}>
                Sign in again on a safe device
              </PrimaryButton>
            </View>
          </Card>
          <SecondaryButton
            onPress={() =>
              Alert.alert("Connecting to 24/7 WelliRecord Patient Support…")
            }
          >
            Contact recovery support
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
