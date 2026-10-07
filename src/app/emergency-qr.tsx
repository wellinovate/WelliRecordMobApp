import React from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

const emergencyFields = [
  ["Identity, blood group & genotype", "Adaeze Okafor · O+ · AA"],
  ["Allergy & important condition", "Penicillin: rash · Hypertension"],
  ["Medication relevant to emergency care", "Amlodipine 5 mg daily"],
  ["Emergency contact", "Chidi Okafor · +234 803 555 0142"],
] as const;

export default function EmergencyQrScreen() {
  const { emergencyActive, activateEmergency } = useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Your emergency QR" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Card className="items-center shadow-md">
            <View className="mx-auto size-36 items-center justify-center rounded-xl border border-[#dae2ee] bg-white p-2">
              <Icon size={120} src={icons.emergencyQr} />
            </View>
            <Text className="mt-4 text-sm font-semibold text-[#031f50]">
              Adaeze Okafor · WR-4821-0936
            </Text>
            <Text className="mt-3 text-center text-xs leading-[1.45] text-[#53657c]">
              Scanning opens a secure emergency interface, not your complete
              health record. Online authorization is required.
            </Text>
          </Card>

          <View className="flex-row items-center justify-between">
            <SectionTitle>Your authorized emergency fields</SectionTitle>
            <Pressable
              accessibilityRole="button"
              onPress={() => Alert.alert("Edit emergency medical profile")}
            >
              <Text className="text-xs font-semibold text-[#24518c]">
                Edit
              </Text>
            </Pressable>
          </View>

          <Card className="gap-4">
            {emergencyFields.map(([title, detail]) => (
              <Choice
                detail={detail}
                icon={icons.shield}
                key={title}
                selected
                title={title}
              />
            ))}
            <Text className="text-xs text-[#53657c]">
              Lab history, documents and full record are excluded.
            </Text>
          </Card>

          <Guidance title="Authorized emergency personnel only">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Each access is limited to 10 minutes and logged with the
              viewer, time and emergency purpose.
            </Text>
          </Guidance>
          <Guidance title="Offline copy · Last synced today, 08:42">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Essentials are stored on this device. This copy may miss
              changes since sync. QR authorization needs connectivity.
            </Text>
          </Guidance>
          <Guidance title="Before you activate emergency mode" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              We will notify Chidi and share only the selected essentials
              with him for 10 minutes. Your location stays off unless you
              opt in.
            </Text>
          </Guidance>

          {emergencyActive && (
            <Guidance title="Emergency sharing is active">
              <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                Your selected essentials are currently shared. Open the
                emergency screen to review or end access.
              </Text>
            </Guidance>
          )}

          <PrimaryButton danger onPress={activateEmergency}>
            {emergencyActive ? "View active emergency" : "I'm in an emergency"}
          </PrimaryButton>
          <SecondaryButton
            onPress={() =>
              Alert.alert("Emergency QR card saved to Photos")
            }
          >
            Save emergency QR card
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
