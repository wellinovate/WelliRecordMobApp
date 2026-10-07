import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, Alert } from "react-native";
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
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";
import { hapticFeedback } from "../utils/haptics";

const STEPS = [
  ["Registration", "WelliID verified · 9:20 AM", true],
  ["Triage", "Vitals recorded · 9:32 AM", true],
  ["Doctor · You are here", "Dr Amaka Bello · Appointment 10:30 AM", false],
  ["Laboratory", "Only if ordered by your clinician", false],
  ["Pharmacy", "Review any prescription after your visit", false],
  ["Payment & complete", "Review final bill and visit summary", false],
] as const;

function WelliPaySheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [paid, setPaid] = useState(false);

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <Pressable
        accessibilityRole="button"
        className="flex-1 justify-end bg-black/40"
        onPress={onClose}
      >
        <Pressable className="rounded-t-[24px] bg-white p-[22px]">
          <View className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#dae2ee]" />
          {paid ? (
            <View className="items-center py-4">
              <View className="size-14 items-center justify-center rounded-full bg-[#031f50]">
                <Icon size={26} src={icons.success} />
              </View>
              <Text className="mt-4 text-lg font-bold text-[#031f50]">
                Payment received
              </Text>
              <Text className="mt-2 text-center text-xs text-[#53657c]">
                Bill LG-B051026-073 · ₦5,000 · WelliPay
              </Text>
              <View className="mt-6 w-full">
                <PrimaryButton onPress={onClose}>Done</PrimaryButton>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-lg font-bold text-[#031f50]">
                WelliPay checkout
              </Text>
              <Text className="mt-2 text-xs text-[#53657c]">
                Bill LG-B051026-073
              </Text>
              <View className="mt-4 rounded-[14px] bg-[#edf2fa] p-4">
                <Text className="text-sm font-semibold text-[#031f50]">
                  Registration fee
                </Text>
                <Text className="mt-2 text-2xl font-bold text-[#031f50]">
                  ₦5,000
                </Text>
                <Text className="mt-2 text-xs text-[#53657c]">
                  Not covered by HMO
                </Text>
              </View>
              <View className="mt-5 flex-row gap-3">
                <View className="flex-1">
                  <SecondaryButton onPress={onClose}>Cancel</SecondaryButton>
                </View>
                <View className="flex-1">
                  <PrimaryButton
                    onPress={() => {
                      hapticFeedback.success();
                      setPaid(true);
                    }}
                  >
                    Pay ₦5,000
                  </PrimaryButton>
                </View>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function CareJourneyScreen() {
  const [payOpen, setPayOpen] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Your care journey" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Guidance title="Adaeze · WR-4821-0936">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Visit LG-051026-073 · Checked in at 9:20 AM{"\n"}You can keep
              your phone with you.
            </Text>
          </Guidance>
          <SectionTitle>Your care journey</SectionTitle>
          <Card>
            {STEPS.map(([title, detail, complete], index) => (
              <View className="flex-row gap-3" key={title}>
                <View className="w-7 items-center">
                  <View
                    className={`size-7 items-center justify-center rounded-full ${
                      index === 2 || complete ? "bg-[#031f50]" : "bg-[#edf2fa]"
                    }`}
                  >
                    {complete ? (
                      <Icon size={14} src={icons.check} />
                    ) : (
                      <Text
                        className={`text-xs font-semibold ${
                          index === 2 ? "text-white" : "text-[#53657c]"
                        }`}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  {index < STEPS.length - 1 && (
                    <View className="min-h-8 w-0.5 flex-1 bg-[#dae2ee]" />
                  )}
                </View>
                <View className="flex-1 pb-5">
                  <Text className="text-sm font-semibold text-[#031f50]">
                    {title}
                  </Text>
                  <Text className="mt-1 text-xs text-[#53657c]">{detail}</Text>
                </View>
              </View>
            ))}
          </Card>
          <Guidance title="Waiting for your clinician">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Please stay near the waiting area. Your slot is at 10:30 AM;
              timing may change. Ask reception if you need help or your
              symptoms worsen.
            </Text>
          </Guidance>
          <SectionTitle>This visit's healthcare bill</SectionTitle>
          <Card>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-[#031f50]">
                WelliPay
              </Text>
              <Badge tone="amber">Payment due</Badge>
            </View>
            <Text className="mt-5 text-[27px] font-bold text-[#031f50]">
              ₦5,000
            </Text>
            <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
              Bill LG-B051026-073{"\n"}
              Registration fee · Not covered by HMO{"\n"}
              Consultation: Reliance authorization confirmed.{"\n"}
              No additional test charges yet.
            </Text>
            <View className="mt-5">
              <PrimaryButton onPress={() => setPayOpen(true)}>
                View & pay healthcare bill
              </PrimaryButton>
            </View>
            <Pressable
              accessibilityRole="button"
              className="mt-4"
              onPress={() =>
                Alert.alert("Family payment request sent · Bill only")
              }
            >
              <Text className="text-xs font-semibold text-[#24518c]">
                Request family payment · Bill only
              </Text>
            </Pressable>
          </Card>
          <Text className="text-xs leading-[1.45] text-[#53657c]">
            A payment request shares bill details, not your health record.
            Every authorized record access is logged.
          </Text>
          <SecondaryButton onPress={() => router.push("/(tabs)/home")}>
            Return to home
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
      <WelliPaySheet onClose={() => setPayOpen(false)} visible={payOpen} />
    </View>
  );
}
