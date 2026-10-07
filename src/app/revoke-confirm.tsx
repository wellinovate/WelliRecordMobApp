import React from "react";
import { View, Text, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function RevokeConfirmScreen() {
  const { confirmRevocation } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Review consent" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="items-center rounded-[20px] bg-[#faedea] p-[22px]">
            <View className="size-[60px] items-center justify-center rounded-full bg-[#af4540]">
              <Icon size={28} src={icons.revoke} />
            </View>
            <Text className="mt-3 text-center text-[22px] font-bold leading-[1.3] text-[#031f50]">
              End future access
            </Text>
            <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
              This choice applies to consent C-1031 only.
            </Text>
          </View>

          <Card>
            <Badge>Active · Consent C-1031</Badge>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Dr Amaka Bello · Verified provider
            </Text>
            <Text className="mt-3 text-sm leading-[1.45] text-[#173b71]">
              Laboratory{"\n"}
              Medications & prescriptions{"\n"}
              Medical consultations only
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              Granted 3 Oct 2026, 9:41 AM{"\n"}
              Expires 4 Oct 2026, 9:41 AM · Africa/Lagos
            </Text>
          </Card>

          <Guidance title="What revocation means" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              After online confirmation, future eligible access ends
              immediately. Past views cannot be undone.
            </Text>
          </Guidance>

          <PrimaryButton danger onPress={confirmRevocation}>
            Confirm revoke
          </PrimaryButton>
          <SecondaryButton onPress={() => router.back()}>
            Cancel · Keep access
          </SecondaryButton>

          <Text className="text-center text-xs text-[#53657c]">
            Restoring access will require a new consent choice.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
