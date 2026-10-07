import React, { useRef, useState } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

export default function VerifyPhoneScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const complete = code.every(Boolean);
  const inputs = useRef<Array<TextInput | null>>([]);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Verify your phone" />
      <ScrollView className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View>
            <Text className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#53657c]">
              NEW ACCOUNT · STEP 2 OF 4
            </Text>
            <Text className="mt-2 text-2xl font-bold text-[#031f50]">
              Verify your phone
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Enter the 6-digit code sent to your demo contact.
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
              Demo destination · +234 800 000 0000
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
              Code expires 10 minutes after it is sent. Resending replaces
              the previous code.
            </Text>
          </View>

          <PrimaryButton
            disabled={!complete}
            onPress={() => router.push("/onboarding-id")}
          >
            Verify contact
          </PrimaryButton>
          <SecondaryButton
            onPress={() => setCode(["4", "8", "2", "1", "0", "9"])}
          >
            Resend code (Fill Demo)
          </SecondaryButton>
          <SecondaryButton onPress={() => router.push("/create-account")}>
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
