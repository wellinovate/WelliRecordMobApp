import React, { useRef, useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

export default function VerifyRecoveryScreen() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const complete = code.every(Boolean);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    if (digit && index < code.length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

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
            copy="You are recovering access on another device."
            eyebrow="RECOVERY · PROTECTED VERIFICATION"
            title="Verify it's you"
          />
          <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
              <Icon size={28} src={icons.shieldRecovery} />
            </View>
            <Text className="mt-4 text-center text-[22px] font-bold leading-[1.3] text-[#031f50]">
              Check your verified contact
            </Text>
            <Text className="mt-3 text-sm text-[#53657c]">
              SMS destination · +234 803 ••• 0142
            </Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              6-digit recovery code
            </Text>
            <View className="mt-3 flex-row gap-2">
              {code.map((digit, index) => (
                <TextInput
                  accessibilityLabel={`Recovery digit ${index + 1}`}
                  className="h-14 flex-1 rounded-xl border border-[#cbd7e8] bg-white text-center text-xl font-bold text-[#031f50]"
                  key={index}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(value) => handleChange(index, value)}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                />
              ))}
            </View>
            <Text className="mt-3 text-sm leading-[1.45] text-[#53657c]">
              Code expires 10 minutes after sending. A new code invalidates
              the old one. Never reuse a sign-in or recovery code.
            </Text>
          </View>
          <PrimaryButton
            disabled={!complete}
            onPress={() => router.push("/recovered")}
          >
            Verify & continue
          </PrimaryButton>
          <SecondaryButton
            onPress={() => setCode(["1", "2", "3", "4", "5", "6"])}
          >
            Resend recovery code (Fill Demo)
          </SecondaryButton>
          <Guidance title="Recovery is protected">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Verification is needed before changing security settings. No
              medical record is shared during recovery.
            </Text>
          </Guidance>
          <Card>
            <Text className="text-sm font-semibold text-[#031f50]">
              Can't access this contact?
            </Text>
            <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
              Try an existing passkey or verified email. If neither works,
              contact recovery support for identity checks.
            </Text>
          </Card>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
