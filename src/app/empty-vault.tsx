import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
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

export default function EmptyVaultScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="My health records" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Adaeze Okafor · WR-4821-0936"
            eyebrow="NEW ACCOUNT · NO RECORDS LINKED"
            title="Your Health Vault"
          />
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.vault} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Your first record starts here
            </Text>
            <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
              No health records yet. No diagnoses or record totals are
              assumed.
            </Text>
          </View>
          <PrimaryButton onPress={() => router.push("/(tabs)/records")}>
            Add a document
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/care-discovery")}>
            Connect a participating provider
          </SecondaryButton>
          <Card>
            <Row
              detail="Ask your provider for a copy of your earlier reports."
              icon={icons.files}
              title="Request prior records"
            />
            <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
              A PDF or photo is enough to begin. Keep the original and check
              that the name, date and source are readable.
            </Text>
          </Card>
          <Guidance title="Adding a record does not share it">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              You choose recipients, scope and duration separately in Share.
            </Text>
          </Guidance>
          <Guidance title="Know where a record came from">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Look for Verified provider, Patient Added or Imported labels.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
