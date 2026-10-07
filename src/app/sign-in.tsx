import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  LabeledInput,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";
import { contactFromInput, sendOtp } from "../services/authService";

export default function SignInScreen() {
  const { startAccountCreation } = useWelli();
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    const parsed = contactFromInput(contact);
    setSending(true);
    setError(null);
    try {
      await sendOtp(parsed, "login");
      router.push({
        pathname: "/verify-phone",
        params: { contact: contact.trim(), mode: "login" },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Welcome back" />
      <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              RETURNING USER · SECURE ACCESS
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Welcome back
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Enter the phone number or email on your account. We send a 6-digit code.
            </Text>
          </View>

          <LabeledInput
            autoCapitalize="none"
            autoComplete="tel"
            keyboardType="email-address"
            label="Phone number or email"
            onChangeText={setContact}
            placeholder="0803 000 0000 or you@example.com"
            value={contact}
          />
          {error && <Text className="text-xs text-[#af4540]">{error}</Text>}
          <PrimaryButton
            disabled={sending || contact.trim().length < 5}
            onPress={handleSendCode}
          >
            {sending ? "Sending code..." : "Send me a code"}
          </PrimaryButton>

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
