import React from "react";
import { View, Text, ScrollView } from "react-native";
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
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

export default function OfflineScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Saved offline" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Some saved information is available on this device."
            eyebrow="RELIABILITY · CACHED VIEW · 3 OCT 2026"
            title="You're offline"
          />
          <Guidance title="Last synced 3 Oct 2026, 08:42" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Africa/Lagos · Saved information may be out of date. This view
              cannot confirm recent clinical changes or current access
              permissions.
            </Text>
          </Guidance>
          <Card>
            <Badge>Cached emergency basics</Badge>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Adaeze Okafor · WR-4821-0936
            </Text>
            <Text className="mt-3 text-sm leading-[1.5] text-[#173b71]">
              O+ blood · AA genotype{"\n"}
              Penicillin allergy · Rash{"\n"}
              Provider-confirmed source at last sync
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              Emergency contact: Chidi Okafor · Husband{"\n"}
              +234 803 555 0142
            </Text>
            <Text className="mt-3 text-xs text-[#53657c]">
              Confirm current details with the patient or clinician; do not
              assume this is a live record.
            </Text>
          </Card>
          <SectionTitle>Waiting for connection</SectionTitle>
          <Card>
            <Row
              detail="Full blood count.pdf · 284 KB"
              icon={icons.cloudUpload}
              title="1 queued upload"
            />
            <View className="mt-4">
              <Badge tone="amber">Consented queue · Not uploaded</Badge>
            </View>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              You chose to queue this file. It awaits connection; it is not
              added to your record.
            </Text>
          </Card>
          <Guidance title="Low-data mode · On">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Sync text first. Download PDFs on Wi-Fi. No sensitive health
              details sent by SMS.
            </Text>
          </Guidance>
          <Guidance title="Consent changes need you online">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Granting or revoking access requires online confirmation.
            </Text>
          </Guidance>
          <PrimaryButton onPress={() => router.push("/(tabs)/records")}>
            Check connection
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/(tabs)/profile")}>
            View saved emergency basics
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
