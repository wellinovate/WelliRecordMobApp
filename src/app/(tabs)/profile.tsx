import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../../components/common";
import { icons } from "../../constants/icons";
import { useWelli } from "../../state/WelliContext";

export default function ProfileScreen() {
  const { signOut } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header title="My profile" />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <Card>
            <Text className="text-[11px] font-semibold text-[#53657c]">
              MY ACCOUNT
            </Text>
            <Text className="mt-3 text-xl font-bold text-[#031f50]">
              Adaeze Okafor
            </Text>
            <Text className="mt-2 text-sm font-semibold text-[#24518c]">
              WR-4821-0936
            </Text>
            <Text className="mt-3 text-xs leading-[1.5] text-[#53657c]">
              Female · 34 years · 14 Jun 1992{"\n"}Lagos, Nigeria
            </Text>
          </Card>

          <SectionTitle>Coverage & records</SectionTitle>
          <Card className="gap-4">
            <Row
              detail="Member RL-209184 · Valid to 31 Dec 2026"
              icon={icons.shield}
              title="Reliance HMO · Active"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="4 participating providers · Last synced 08:42"
              icon={icons.link}
              onPress={() => router.push("/(tabs)/records")}
              title="24 linked health records"
            />
            <View>
              <Badge>Consent controlled · 2 active grants</Badge>
            </View>
          </Card>

          <Guidance title="Your WelliID is not a national ID">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              NIN linkage is optional and not yet linked. We only request it
              where appropriate.
            </Text>
          </Guidance>

          <SectionTitle action="Review" onAction={() => router.push("/emergency-qr")}>
            Emergency basics
          </SectionTitle>
          <Card>
            <Text className="text-sm font-semibold text-[#031f50]">
              Penicillin allergy · Hypertension
            </Text>
            <Text className="mt-3 text-xs text-[#53657c]">
              Contact: Chidi Okafor · Husband{"\n"}+234 803 555 0142
            </Text>
            <Pressable
              accessibilityRole="button"
              className="mt-4"
              onPress={() => router.push("/emergency-qr")}
            >
              <Text className="text-xs font-semibold text-[#24518c]">
                Review emergency access →
              </Text>
            </Pressable>
          </Card>

          <Card className="gap-4">
            <Row
              detail="Separate identities. Limited access, with expiry."
              icon={icons.people}
              title="Family & caregivers"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Protect your identity and manage permissions"
              icon={icons.lock}
              onPress={() => router.push("/lost-phone")}
              title="Security & privacy"
            />
          </Card>

          <SectionTitle>Account & accessibility</SectionTitle>
          <Card className="gap-4">
            <Row
              detail="Language, larger text and reading support"
              icon={icons.book}
              onPress={() => router.push("/preferences")}
              title="Language & accessibility"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Recover access or review trusted sessions"
              icon={icons.key}
              onPress={() => router.push("/recover-account")}
              title="Account recovery"
            />
          </Card>

          <PrimaryButton onPress={() => router.push("/(tabs)/consent-expanded")}>
            Open Consent Center
          </PrimaryButton>
          <SecondaryButton onPress={signOut}>Sign out</SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
