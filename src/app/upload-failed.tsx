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

export default function UploadFailedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Document upload" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="A network problem interrupted the transfer."
            eyebrow="RELIABILITY · LOCAL DRAFT PRESERVED"
            title="Your upload didn't finish"
          />
          <View className="items-center rounded-[20px] bg-[#faedea] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#af4540]">
              <Icon size={28} src={icons.cloudOff} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              You can try again
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              Your selected PDF is still saved as a local pending draft.
            </Text>
          </View>
          <Card>
            <Row
              detail="284 KB · 2 pages · Selected on this device"
              icon={icons.fileText}
              title="Full blood count.pdf"
            />
            <View className="mt-4">
              <Badge tone="red">Upload failed · Network error</Badge>
            </View>
            <View className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf2fa]">
              <View className="h-full w-[42%] bg-[#af4540]" />
            </View>
            <Text className="mt-3 text-xs text-[#53657c]">
              Transfer interrupted at 42%. Server receipt is not confirmed.
            </Text>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Not added to your clinical record
            </Text>
          </Card>
          <Guidance title="Nothing has been queued automatically" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Retry sends this selected file now. Save for later keeps the
              draft on this device.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/(tabs)/records")}>
            Retry upload
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/offline")}>
            Save draft for later
          </SecondaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/records")}>
            Remove local draft
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
