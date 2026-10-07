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
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function OnboardingRecordScreen() {
  const { completeOnboarding } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Start with one record" />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              NEW ACCOUNT · STEP 4 OF 4
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Start with one record
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Your WelliID is ready. Your new Vault is empty.
            </Text>
          </View>

          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.folderPlus} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              No records connected yet
            </Text>
            <Text className="mt-3 text-sm leading-[1.45] text-[#53657c]">
              Add one when you are ready. You can also skip this step.
            </Text>
          </View>

          <Card className="gap-4">
            <Row
              detail="Review a connection request and its purpose."
              icon={icons.hospital}
              title="Connect a participating provider"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Choose a PDF or photo from your device."
              icon={icons.upload}
              onPress={() => router.push("/upload-failed")}
              title="Upload a document"
            />
            <Text className="text-xs leading-[1.45] text-[#53657c]">
              Connecting does not automatically give a provider access to
              your other records.
            </Text>
          </Card>

          <Guidance title="You will always see the source">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Provider-issued records show Verified provider. Your uploads
              show Patient Added. Imported records are not automatically
              verified.
            </Text>
          </Guidance>
          <Guidance title="AI extraction needs your review">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Check extracted values against the original before confirming.
            </Text>
          </Guidance>

          <PrimaryButton onPress={() => completeOnboarding("records")}>
            Connect a provider
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/upload-failed")}>
            Upload a document
          </SecondaryButton>
          <SecondaryButton onPress={() => completeOnboarding("home")}>
            Skip for now
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
