import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  Row,
  ScreenStack,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";
import {
  medicationReminderService,
  type MedicationItem,
} from "../services/medicationReminderService";
import { hapticFeedback } from "../utils/haptics";

const WEEK_DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function MedicationsScreen() {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    medicationReminderService.getMedications().then((meds) => {
      setMedications(meds);
      setLoaded(true);
    });
  }, []);

  const handleToggle = useCallback(async (id: string) => {
    hapticFeedback.light();
    const updated = await medicationReminderService.toggleTaken(id);
    setMedications(updated);
  }, []);

  const takenCount = medications.filter((m) => m.takenToday).length;
  const evening = medications.find((m) => m.time.includes("PM"));
  const morning = medications.find((m) => m.time.includes("AM"));

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Medications" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="flex-row rounded-[14px] bg-[#edf2fa] p-1">
            <Pressable
              accessibilityRole="button"
              className={`flex-1 rounded-[11px] py-2.5 ${
                activeTab === "current" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setActiveTab("current")}
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  activeTab === "current" ? "text-[#031f50]" : "text-[#53657c]"
                }`}
              >
                Current · {medications.length}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className={`flex-1 rounded-[11px] py-2.5 ${
                activeTab === "past" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setActiveTab("past")}
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  activeTab === "past" ? "text-[#031f50]" : "text-[#53657c]"
                }`}
              >
                Past · 1
              </Text>
            </Pressable>
          </View>

          <Card className="bg-[#edf2fa]">
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] font-semibold text-[#031f50]">
                This week's routine
              </Text>
              <Text className="text-[11px] font-semibold text-[#031f50]">
                {takenCount} of {medications.length} taken today
              </Text>
            </View>
            <View className="mt-4 flex-row justify-between">
              {WEEK_DAYS.map((d, i) => (
                <View className="items-center" key={`${d}-${i}`}>
                  <View
                    className={`size-8 items-center justify-center rounded-full ${
                      i === 4 ? "bg-white shadow-sm" : "bg-[#031f50]"
                    }`}
                  >
                    <Icon size={15} src={i === 4 ? icons.minus : icons.check} />
                  </View>
                  <Text className="mt-1 text-[10px] text-[#53657c]">{d}</Text>
                </View>
              ))}
            </View>
            <Text className="mt-3 text-[11px] text-[#53657c]">
              Self-reported dose logs, not proof of use.
            </Text>
          </Card>

          <SectionTitle>Today</SectionTitle>

          {loaded && evening && (
            <Card>
              <View className="flex-row items-center justify-between">
                <Icon src={icons.pill} />
                <Badge tone="amber">{evening.time} reminder</Badge>
              </View>
              <Text className="mt-4 text-lg font-bold text-[#031f50]">
                {evening.name} · {evening.dosage}
              </Text>
              <Text className="mt-3 text-sm leading-[1.45] text-[#173b71]">
                {evening.frequency}
                {"\n"}
                {evening.instructions}
              </Text>
              <Text className="mt-4 text-xs text-[#53657c]">
                {evening.remainingDays} days remaining
              </Text>
              <View className="mt-4 flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  className={`h-12 flex-1 items-center justify-center rounded-xl active:scale-[0.98] ${
                    evening.takenToday ? "bg-[#edf2fa]" : "bg-[#031f50]"
                  }`}
                  onPress={() => handleToggle(evening.id)}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      evening.takenToday ? "text-[#031f50]" : "text-white"
                    }`}
                  >
                    {evening.takenToday ? "Undo taken" : "✓  Taken"}
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  className="h-12 flex-1 items-center justify-center rounded-xl border border-[#dae2ee] bg-white active:scale-[0.98]"
                >
                  <Text className="text-sm font-semibold text-[#031f50]">
                    Snooze
                  </Text>
                </Pressable>
              </View>
              <Pressable accessibilityRole="button" className="mt-3">
                <Text className="text-xs font-semibold text-[#53657c]">
                  Mark skipped · Add a reason
                </Text>
              </Pressable>
            </Card>
          )}

          {loaded && morning && (
            <Card>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-[#031f50]">
                  {morning.name} · {morning.dosage}
                </Text>
                <Badge>{morning.takenToday ? "Taken" : "Pending"}</Badge>
              </View>
              <Text className="mt-3 text-sm text-[#173b71]">
                {morning.frequency}
                {"\n"}
                {morning.instructions}
              </Text>
              <Text className="mt-4 text-xs text-[#53657c]">
                Scheduled {morning.time}
              </Text>
              <View className="mt-3">
                <Badge>Verified prescription</Badge>
              </View>
            </Card>
          )}

          <Guidance title="Safety information, not prescribing advice" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Penicillin allergy is on your record. Ask your clinician or
              pharmacist before changes.
            </Text>
          </Guidance>

          <Row
            detail="8:00 AM & 8:00 PM · Notifications enabled"
            icon={icons.bell}
            title="Reminder preferences"
          />
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
