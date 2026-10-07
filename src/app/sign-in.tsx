import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";
import { authenticateWithBiometrics } from "../utils/biometrics";

export default function SignInScreen() {
  const { signIn, startAccountCreation } = useWelli();
  const [authenticating, setAuthenticating] = useState(false);

  const handlePasskey = async () => {
    setAuthenticating(true);
    const res = await authenticateWithBiometrics(
      "Verify Face ID for Adaeze Okafor"
    );
    setAuthenticating(false);
    if (res.success) {
      signIn();
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Welcome back" />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              RETURNING USER · SECURE ACCESS
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Welcome back
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Use your passkey or verified contact to continue.
            </Text>
          </View>

          <Card>
            <Text className="text-sm font-semibold text-[#031f50]">
              Adaeze Okafor
            </Text>
            <Text className="mt-2 text-xs text-[#53657c]">
              WR-4821-0936 · Last active today, 08:42
            </Text>
          </Card>

          <PrimaryButton onPress={handlePasskey}>
            {authenticating
              ? "Verifying Face ID..."
              : "Continue with passkey / Face ID"}
          </PrimaryButton>
          <SecondaryButton onPress={signIn}>
            Send a code to my verified phone
          </SecondaryButton>

          <Guidance title="Your records stay protected">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Signing in restores access to your existing WelliID and
              records. It does not create a new health record or change
              consent.
            </Text>
          </Guidance>

          <Card>
            <Row
              detail="Use a verified contact or complete identity checks"
              icon={icons.key}
              onPress={() => router.push("/recover-account")}
              title="Can't sign in?"
            />
          </Card>

          <View className="h-px bg-[#dae2ee]" />
          <Text className="text-center text-xs text-[#53657c]">
            New to WelliRecord?
          </Text>
          <SecondaryButton onPress={startAccountCreation}>
            Create an account
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
