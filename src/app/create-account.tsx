import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  LabeledInput,
  PrimaryButton,
  ScreenStack,
} from "../components/common";
import { icons } from "../constants/icons";
import { sendOtp } from "../services/authService";

export default function CreateAccountScreen() {
  const [email, setEmail] = useState(false);
  const [terms, setTerms] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactValue = (email ? emailAddress : phone).trim();
  const canContinue =
    terms && fullName.trim().length > 1 && contactValue.length > 4 && !sending;

  const handleContinue = async () => {
    setSending(true);
    setError(null);
    try {
      await sendOtp(
        email ? { email: contactValue.toLowerCase() } : { phone: contactValue },
        "signup",
        fullName.trim()
      );
      router.push({
        pathname: "/verify-phone",
        params: {
          contact: contactValue,
          mode: "signup",
          fullName: fullName.trim(),
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code.");
    } finally {
      setSending(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Create your account" />
      <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              NEW ACCOUNT · STEP 1 OF 4
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Create your account
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Use a phone number or email you can access.
            </Text>
          </View>

          <LabeledInput
            autoCapitalize="words"
            helper="Use the name you use with your healthcare provider."
            label="Full name"
            onChangeText={setFullName}
            value={fullName}
          />

          <Card className="gap-4">
            <Choice
              detail="Receive a code by SMS"
              icon={icons.smartphone}
              onPress={() => setEmail(false)}
              selected={!email}
              title="Phone number"
            />
            {!email && (
              <LabeledInput
                className="pl-[34px]"
                keyboardType="phone-pad"
                label="Nigeria (+234) · Phone"
                onChangeText={setPhone}
                placeholder="0803 000 0000"
                value={phone}
              />
            )}
            {email && (
              <LabeledInput
                autoCapitalize="none"
                className="pl-[34px]"
                keyboardType="email-address"
                label="Email address"
                onChangeText={setEmailAddress}
                placeholder="you@example.com"
                value={emailAddress}
              />
            )}
            <Choice
              detail="Receive verification code via email"
              icon={icons.link}
              onPress={() => setEmail(true)}
              selected={email}
              title="Use email instead"
            />
          </Card>

          <Choice
            detail="Required for account setup · Read privacy and terms →"
            icon={icons.shield}
            onPress={() => setTerms(!terms)}
            selected={terms}
            title="I acknowledge the Privacy Notice and agree to the Terms"
          />

          <Guidance title="Optional choices · Off">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Research participation is off. Record sharing is not granted
              here. Any future request needs a separate scope, purpose and
              duration choice.
            </Text>
          </Guidance>

          {error && <Text className="text-xs text-[#af4540]">{error}</Text>}
          <PrimaryButton disabled={!canContinue} onPress={handleContinue}>
            {sending ? "Sending code..." : "Continue to verify contact"}
          </PrimaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
