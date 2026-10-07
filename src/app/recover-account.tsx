import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  PrimaryButton,
  Row,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

export default function RecoverAccountScreen() {
  const [useEmail, setUseEmail] = useState(false);
  const [contact, setContact] = useState("+234 803 555 0142");

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Account recovery" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Use a contact or passkey you previously verified."
            eyebrow="RECOVERY · BEFORE AUTHENTICATION"
            title="Recover your account"
          />
          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              Phone number or email
            </Text>
            <TextInput
              className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50]"
              onChangeText={setContact}
              value={contact}
            />
            <Text className="mt-2 text-xs text-[#53657c]">
              Verified contact for Adaeze Okafor.
            </Text>
          </View>
          <Card className="gap-4">
            <Choice
              detail="Send a private verification code via SMS"
              icon={icons.smartphone}
              onPress={() => setUseEmail(false)}
              selected={!useEmail}
              title="Recover with verified phone"
            />
            <Choice
              detail="Use an email you added to this account"
              icon={icons.link}
              onPress={() => setUseEmail(true)}
              selected={useEmail}
              title="Use verified email instead"
            />
            <Text className="text-xs leading-[1.45] text-[#53657c]">
              If an account matches, instructions will be sent. This does
              not reveal whether an entered account exists.
            </Text>
          </Card>
          <PrimaryButton onPress={() => router.push("/verify-recovery")}>
            Request recovery instructions
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/recovered")}>
            Recover with an existing passkey
          </SecondaryButton>
          <Guidance title="Your health identity is not lost">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Your WelliID and server-held records remain even if your phone
              is lost. Recovery protects access; it does not delete medical
              records.
            </Text>
          </Guidance>
          <Card onPress={() => router.push("/lost-phone")}>
            <Row
              detail="Secure sessions after identity verification."
              icon={icons.smartphone}
              title="Lost your phone?"
            />
          </Card>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
