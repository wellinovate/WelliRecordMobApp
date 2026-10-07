import React from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function WelcomeScreen() {
  const { startAccountCreation } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header
        onRightAction={() =>
          Alert.alert("WelliRecord Patient Help & Support Desk")
        }
        rightAction="help"
        title="Welcome"
      />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              NEW ACCOUNT · BEFORE RECORD LINKING
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Welcome
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              A safe place to start your health record.
            </Text>
          </View>

          <View className="rounded-[20px] bg-[#edf2fa] p-6">
            <Image className="size-[52px]" source={icons.logo} />
            <Text className="mt-6 text-[31px] font-bold leading-[1.2] text-[#031f50]">
              Your health record.{"\n"}Your identity.{"\n"}Your control.
            </Text>
            <Text className="mt-6 text-sm leading-[1.45] text-[#173b71]">
              Bring records together, understand their sources and choose who
              can see them.
            </Text>
          </View>

          <Card className="gap-4">
            <Row
              detail="Your WelliID stays with you, not your phone."
              icon={icons.fingerprint}
              title="One health identity"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Choose records, recipients and duration."
              icon={icons.shield}
              title="Permission, not assumptions"
            />
          </Card>

          <PrimaryButton onPress={startAccountCreation}>
            Create account
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/sign-in")}>
            Sign in
          </SecondaryButton>
          <SecondaryButton onPress={() => router.push("/preferences")}>
            Language & accessibility
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
