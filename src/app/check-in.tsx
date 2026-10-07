import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
  Row,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";

export default function CheckInScreen() {
  const { confirmCheckIn } = useWelli();
  const [camera, setCamera] = useState(false);
  const [welliId, setWelliId] = useState("WR-4821-0936");

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Visit check-in" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="At the participating hospital? Match your visit first."
            eyebrow="ARRIVAL · 5 OCT 2026 · BEFORE CHECK-IN"
            title="Check in at Lagoon"
          />
          <Card>
            <Badge>Matched appointment</Badge>
            <View className="mt-4">
              <Row
                detail="WR-4821-0936 · LG-051026-073"
                icon={icons.calendarCheck}
                title="Adaeze Okafor"
              />
            </View>
            <Text className="mt-4 text-xs leading-[1.45] text-[#53657c]">
              Dr Amaka Bello · Today, 10:30 AM. Confirm facility and
              appointment with reception.
            </Text>
          </Card>
          <View className="min-h-[176px] items-center justify-center rounded-[20px] border border-[#dae2ee] bg-[#edf2fa] p-6">
            <Icon size={54} src={icons.scanCheckin} />
            <Text className="mt-5 text-center text-sm font-semibold text-[#031f50]">
              {camera
                ? "Camera scanning active · Point at desk QR"
                : "Camera scanner ready"}
            </Text>
          </View>
          <Text className="text-sm leading-[1.45] text-[#53657c]">
            Allow camera access to scan the facility check-in QR. Used only
            for scanning; you can enter your WelliID instead.
          </Text>
          <PrimaryButton
            onPress={() => {
              if (camera) confirmCheckIn();
              else setCamera(true);
            }}
          >
            {camera
              ? "Confirm QR scan & check in"
              : "Allow camera & scan facility QR"}
          </PrimaryButton>
          <View>
            <Text className="text-sm font-semibold text-[#031f50]">
              Or enter your WelliID
            </Text>
            <TextInput
              className="mt-2 h-12 w-full rounded-xl border border-[#dae2ee] bg-white px-3 text-sm text-[#031f50]"
              onChangeText={setWelliId}
              value={welliId}
            />
          </View>
          <SecondaryButton onPress={confirmCheckIn}>
            Check in with WelliID
          </SecondaryButton>
          <Guidance title="Check-in is not record sharing">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              The QR opens a secure, minimum-necessary endpoint. Your
              record-sharing scope stays separate.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
