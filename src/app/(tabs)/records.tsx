import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, Pressable } from "react-native";
import { router } from "expo-router";
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  Row,
  ScreenStack,
  SectionTitle,
} from "../../components/common";
import { icons } from "../../constants/icons";
import { useWelli } from "../../state/WelliContext";

export const recordCategories = [
  [icons.stethoscope, "Medical", "4 records"],
  [icons.lab, "Laboratory", "6 reports"],
  [icons.imaging, "Imaging", "2 reports"],
  [icons.pill, "Medications", "2 current"],
  [icons.fileHeart, "Prescriptions", "3 records"],
  [icons.syringe, "Vaccinations", "3 records"],
  [icons.allergy, "Allergies", "1 confirmed"],
  [icons.activity, "Procedures", "1 record"],
  [icons.files, "Documents", "2 files"],
] as const;

export default function RecordsScreen() {
  const { recordAdded } = useWelli();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = recordCategories.filter(([, label]) =>
    label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryTarget = (label: string): string | undefined => {
    if (label === "Laboratory") return "/reports";
    if (label === "Medications") return "/medications";
    if (label === "Medical") return "/timeline";
    return undefined;
  };

  return (
    <View className="flex-1 bg-white">
      <Header
        onRightAction={() => router.push("/(tabs)/profile")}
        rightAction="avatar"
        title="My health records"
      />
      <ScrollView automaticallyAdjustKeyboardInsets keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" className="flex-1" contentContainerClassName="px-[22px] pb-10 pt-5">
        <ScreenStack>
          <View className="h-[52px] flex-row items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4">
            <Icon src={icons.search} />
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setSearchQuery}
              placeholder="Search a test, medicine or provider"
              placeholderTextColor="#718096"
              value={searchQuery}
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery("")}>
                <Text className="text-xs text-[#718096]">Clear</Text>
              </Pressable>
            ) : null}
          </View>

          <Card>
            <Row
              detail="Ask questions using only the records you choose"
              icon={icons.sparklesRecord}
              onPress={() => router.push("/record-chat")}
              title="Understand my records"
            />
          </Card>

          {recordAdded && (
            <Guidance title="Full blood count added">
              <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                Your reviewed upload is now saved as Patient Added. The
                original file and AI extraction label were retained.
              </Text>
            </Guidance>
          )}

          <View className="flex-row gap-3">
            <Card className="flex-1 p-4" onPress={() => router.push("/timeline")}>
              <Icon src={icons.history} />
              <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                Health timeline →
              </Text>
              <Text className="mt-2 text-xs text-[#53657c]">
                Your story over time
              </Text>
            </Card>
            <Card className="flex-1 p-4" onPress={() => router.push("/health-passport")}>
              <Icon src={icons.book} />
              <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                Health passport →
              </Text>
              <Text className="mt-2 text-xs text-[#53657c]">
                A portable summary
              </Text>
            </Card>
          </View>

          <SectionTitle>Browse your records</SectionTitle>
          <View className="flex-row flex-wrap gap-3">
            {filteredCategories.map(([icon, label, count]) => {
              const target = categoryTarget(label);
              return (
                <Card
                  className="min-h-[124px] w-[47%] p-4"
                  key={label}
                  onPress={target ? () => router.push(target as any) : undefined}
                >
                  <Icon src={icon} />
                  <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                    {label}
                  </Text>
                  <Text className="mt-1 text-xs text-[#53657c]">{count}</Text>
                </Card>
              );
            })}
          </View>

          <SectionTitle>Know where it came from</SectionTitle>
          <Card className="gap-3">
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge>Verified provider</Badge>
              <Text className="text-xs text-[#53657c]">
                Issued by a participating care provider
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge>Patient Added</Badge>
              <Text className="text-xs text-[#53657c]">
                Information or files you added
              </Text>
            </View>
            <View className="flex-row flex-wrap items-center gap-2">
              <Badge>Imported</Badge>
              <Text className="text-xs text-[#53657c]">
                Transferred from an external record
              </Text>
            </View>
          </Card>

          <Guidance title="1 document needs your review" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              AI extracted your uploaded report. Confirm the fields before
              adding it.
            </Text>
          </Guidance>

          <PrimaryButton onPress={() => router.push("/upload-review")}>
            Upload a health document
          </PrimaryButton>

          <SectionTitle>Connection & reliability</SectionTitle>
          <Card className="gap-4">
            <Row
              detail="See saved information and queued work"
              icon={icons.cloudOff}
              onPress={() => router.push("/offline")}
              title="Offline view"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Loading state for laboratory records"
              icon={icons.loader}
              onPress={() => router.push("/labs-loading")}
              title="Reports are loading"
            />
            <View className="h-px bg-[#dae2ee]" />
            <Row
              detail="Review a preserved local upload draft"
              icon={icons.cloudOff}
              onPress={() => router.push("/upload-failed")}
              title="Interrupted upload"
            />
          </Card>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
