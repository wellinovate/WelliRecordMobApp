import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Choice,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";
import {
  pickDocument,
  pickImageFromCamera,
  type PickedMediaResult,
} from "../utils/mediaPicker";

const CATEGORIES = [
  "Laboratory",
  "Prescription",
  "Consultation Summary",
  "Imaging Report",
];

const FIELDS: Array<[string, string]> = [
  ["Test name", "Haemoglobin"],
  ["Result", "10.2"],
  ["Units", "g/dL"],
  ["Laboratory reference range", "12.0–15.5 g/dL"],
  ["Report date", "29 Sep 2026"],
  ["Laboratory", "SYNLAB Ikeja"],
];

export default function UploadReviewScreen() {
  const { addRecord } = useWelli();
  const [reviewed, setReviewed] = useState(true);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [uploadedFile, setUploadedFile] = useState<PickedMediaResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const handlePickDocument = async () => {
    const file = await pickDocument();
    if (file) setUploadedFile(file);
  };

  const handleCameraCapture = async () => {
    setScanning(true);
    const file = await pickImageFromCamera();
    setScanning(false);
    if (file) setUploadedFile(file);
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Review your upload" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-1.5 rounded-full bg-[#031f50] px-3.5 py-2"
              onPress={handlePickDocument}
            >
              <Icon size={14} src={icons.uploadReview} />
              <Text className="text-xs font-semibold text-white">
                Choose PDF / File
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-1.5 rounded-full bg-[#edf2fa] px-3.5 py-2"
              onPress={handleCameraCapture}
            >
              <Icon size={14} src={icons.camera} />
              <Text className="text-xs font-semibold text-[#031f50]">
                {scanning ? "Scanning…" : "Open Camera"}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              className="flex-row items-center gap-1.5 rounded-full bg-[#edf2fa] px-3.5 py-2"
              onPress={handleCameraCapture}
            >
              <Icon size={14} src={icons.scanDocument} />
              <Text className="text-xs font-semibold text-[#031f50]">
                Scan Rx Slip
              </Text>
            </Pressable>
          </View>

          <View className="rounded-[20px] bg-[#edf2fa] p-5">
            <View className="rounded-sm bg-white p-4 shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-bold text-[#031f50]">
                  SYNLAB · LABORATORY REPORT
                </Text>
                {uploadedFile && (
                  <View className="rounded-full bg-[#d6f5e9] px-2 py-0.5">
                    <Text className="text-[9px] font-medium text-[#059669]">
                      Custom Upload
                    </Text>
                  </View>
                )}
              </View>
              <Text className="mt-3 text-[9px] text-[#53657c]">
                Adaeze Okafor · 29 Sep 2026{"\n"}SL-290926-184 · Full blood
                count
              </Text>
              <View className="mt-4 flex-row justify-between border-b border-[#dae2ee] pb-2">
                <Text className="text-[9px] text-[#53657c]">Haemoglobin</Text>
                <Text className="text-[9px] font-bold text-[#031f50]">
                  10.2 g/dL
                </Text>
                <Text className="text-[9px] text-[#53657c]">12.0–15.5</Text>
              </View>
              <View className="mt-2 h-1 bg-[#dae2ee]" />
              <View className="mt-2 h-1 bg-[#dae2ee]" />
            </View>
            <View className="mt-4 flex-row justify-between">
              <Text className="text-[11px] text-[#53657c]">
                {uploadedFile ? uploadedFile.name : "blood-count-sep.pdf · 284 KB"}
              </Text>
              <Text className="text-[11px] text-[#53657c]">Page 1 / 2</Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Badge>Patient-uploaded</Badge>
            <Badge tone="amber">AI Extracted · Unconfirmed</Badge>
          </View>

          <Text className="text-lg font-bold text-[#031f50]">
            We found the following information. Review before adding it to
            your record.
          </Text>

          <Card className="gap-4">
            <View>
              <Text className="text-xs text-[#53657c]">Category</Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <Pressable
                    accessibilityRole="button"
                    className={`rounded-lg border px-3 py-2 ${
                      category === item
                        ? "border-[#031f50] bg-[#031f50]"
                        : "border-[#dae2ee] bg-white"
                    }`}
                    key={item}
                    onPress={() => setCategory(item)}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        category === item ? "text-white" : "text-[#031f50]"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {FIELDS.map(([label, value]) => (
                <View className="min-w-[45%] flex-1" key={label}>
                  <Text className="text-xs text-[#53657c]">{label}</Text>
                  <View className="mt-2 min-h-12 flex-row items-center justify-between rounded-lg border border-[#dae2ee] bg-white px-3">
                    <Text className="text-sm text-[#031f50]">{value}</Text>
                    <Icon size={15} src={icons.pencil} />
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Guidance title="Possible duplicate found" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              This may match your verified SYNLAB report. Compare the files
              before saving. We will not auto-merge or replace either
              record.
            </Text>
          </Guidance>

          <Choice
            detail="Saving retains the original file and the AI extraction label. It does not verify the laboratory source."
            icon={icons.designCheck}
            onPress={() => setReviewed(!reviewed)}
            selected={reviewed}
            title="I reviewed the extracted fields"
          />

          <PrimaryButton
            disabled={!reviewed}
            onPress={reviewed ? addRecord : undefined}
          >
            Confirm & add as Patient Added
          </PrimaryButton>
          <Text className="text-center text-[11px] text-[#53657c]">
            No diagnosis is inferred. AI never silently rewrites your
            medical history.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
