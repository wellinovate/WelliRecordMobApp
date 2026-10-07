import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Icon,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

export default function RecordAddedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header title="Record added" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.success} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Record added
            </Text>
            <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
              Full blood count.pdf is now part of your health record.
            </Text>
          </View>
          <Card>
            <Row
              detail="29 Sep 2026 · SYNLAB Ikeja"
              icon={icons.recordLab}
              title="Full blood count"
            />
            <View className="mt-4 flex-row flex-wrap gap-2">
              <Badge>Patient Added</Badge>
              <Badge tone="amber">AI Extracted · Reviewed</Badge>
            </View>
            <Text className="mt-4 text-xs leading-[1.45] text-[#53657c]">
              The original PDF is retained. This does not verify the
              laboratory source or infer a diagnosis.
            </Text>
          </Card>
          <PrimaryButton onPress={() => router.push("/reports")}>
            View record
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/records")}>
            Return to My Health
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
