import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Choice,
  Guidance,
  LabeledInput,
  PrimaryButton,
  ScreenStack,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";

export default function OnboardingIdScreen() {
  const [informed, setInformed] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Set up your WelliID" />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              NEW ACCOUNT · STEP 3 OF 4
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Set up your WelliID
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              New-account sample · No clinical records linked yet.
            </Text>
          </View>

          <Card className="border-[#031f50] bg-[#031f50]">
            <Text className="text-[10px] text-[#e0e9f8]">
              YOUR NEW HEALTH IDENTIFIER
            </Text>
            <Text className="mt-4 text-[22px] font-semibold text-white">
              WR-4821-0936
            </Text>
            <Text className="mt-3 text-[11px] text-[#e0e9f8]">
              Allocated in this sample flow · Adaeze Okafor
            </Text>
          </Card>

          <LabeledInput
            defaultValue="14 Jun 1992"
            helper="Female · Lagos · Verified account contact: +234 800 000 0000"
            label="Date of birth"
          />

          <View>
            <SectionTitle>Optional health basics</SectionTitle>
            <Card className="mt-3">
              <View className="flex-row gap-3">
                <LabeledInput
                  className="flex-1"
                  defaultValue="O+"
                  label="Blood group"
                />
                <LabeledInput
                  className="flex-1"
                  defaultValue="AA"
                  label="Genotype"
                />
              </View>
              <View className="mt-3">
                <Badge>Added by you · Not clinically verified</Badge>
              </View>
              <Text className="mt-3 text-xs text-[#53657c]">
                These entries are not provider-confirmed history.
              </Text>
            </Card>
          </View>

          <View>
            <SectionTitle>Emergency contact · Optional</SectionTitle>
            <Card className="mt-3">
              <Text className="text-sm font-semibold text-[#031f50]">
                Chidi Okafor · Husband
              </Text>
              <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                +234 803 555 0142{"\n"}Separate WelliID WR-7204-1683
              </Text>
              <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                Tell Chidi that you are adding his details. This does not
                give him access to your record.
              </Text>
              <View className="mt-4">
                <Choice
                  detail="Contact has been notified of their emergency designation"
                  icon={icons.designCheck}
                  onPress={() => setInformed(!informed)}
                  selected={informed}
                  title="I have informed this contact"
                />
              </View>
            </Card>
          </View>

          <Guidance title="Emergency essentials preview">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Name & WelliID and emergency contact are included. Blood group
              and genotype are not included yet.
            </Text>
          </Guidance>
          <Guidance title="WelliID is not a national ID">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              NIN linkage is optional. A health identifier does not replace
              your national ID.
            </Text>
          </Guidance>

          <PrimaryButton onPress={() => router.push("/onboarding-record")}>
            Save basics & continue
          </PrimaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
