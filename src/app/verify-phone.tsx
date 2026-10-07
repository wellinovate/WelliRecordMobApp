import React, { useRef, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";
import {
  contactFromInput,
  sendOtp,
  verifyOtp,
  type AuthMode,
} from "../services/authService";

export default function VerifyPhoneScreen() {
  const params = useLocalSearchParams<{
    contact?: string;
    mode?: string;
    fullName?: string;
  }>();
  const contactText = params.contact ?? "";
  const mode: AuthMode = params.mode === "login" ? "login" : "signup";
  const { establishSession, signIn } = useWelli();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const complete = code.every(Boolean);
  const inputs = useRef<Array<TextInput | null>>([]);
  const isEmail = contactText.includes("@");

  const handleVerify = async () => {
    setBusy(true);
    setError(null);
    try {
      const session = await verifyOtp(
        contactFromInput(contactText),
        code.join(""),
        mode,
        params.fullName
      );
      await establishSession(session);
      if (mode === "login") {
        signIn();
      } else {
        router.push("/onboarding-id");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify the code.");
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await sendOtp(contactFromInput(contactText), mode, params.fullName);
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setNotice("New code sent. The previous one no longer works.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Verify your contact" />
      <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              {mode === "login" ? "SIGN IN · VERIFY" : "NEW ACCOUNT · STEP 2 OF 4"}
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Verify your {isEmail ? "email" : "phone"}
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Enter the 6-digit code we sent.
            </Text>
          </View>

          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.message} />
            </View>
            <Text className="mt-4 text-[22px] font-bold text-[#031f50]">
              Check your messages
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              {contactText}
            </Text>
          </View>

          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              6-digit verification code
            </Text>
            <View className="mt-3 flex-row gap-2">
              {code.map((digit, index) => (
                <TextInput
                  className="h-14 flex-1 rounded-xl border border-[#cbd7e8] bg-white text-center text-xl font-bold text-[#031f50]"
                  key={index}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => {
                    const digitOnly = text.replace(/\D/g, "");
                    const next = [...code];
                    next[index] = digitOnly;
                    setCode(next);
                    if (digitOnly && index < 5) {
                      inputs.current[index + 1]?.focus();
                    }
                  }}
                  ref={(el) => {
                    inputs.current[index] = el;
                  }}
                  value={digit}
                />
              ))}
            </View>
            <Text className="mt-3 text-sm leading-[1.45] text-[#53657c]">
              Code expires after a few minutes. Resending replaces the previous
              code.
            </Text>
          </View>

          {error && <Text className="text-xs text-[#af4540]">{error}</Text>}
          {notice && <Text className="text-xs text-[#24518c]">{notice}</Text>}
          <PrimaryButton disabled={!complete || busy} onPress={handleVerify}>
            {busy ? "Please wait..." : "Verify contact"}
          </PrimaryButton>
          <SecondaryButton disabled={busy} onPress={handleResend}>
            Resend code
          </SecondaryButton>
          <SecondaryButton
            onPress={() =>
              router.replace(mode === "login" ? "/sign-in" : "/create-account")
            }
          >
            Change phone or use email
          </SecondaryButton>

          <Guidance title="Keep your code private">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              WelliRecord support will never ask you to read a verification
              code to them.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
