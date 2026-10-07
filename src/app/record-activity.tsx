import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenStack,
} from "../components/common";
import { icons } from "../constants/icons";
import { useWelli } from "../state/WelliContext";
import { hapticFeedback } from "../utils/haptics";

const activityItems = [
  [
    "You shared with Dr Amaka Bello",
    "3 Oct 2026 · 9:41 AM",
    "Laboratory, medicines & consultations",
    "Purpose: treatment follow-up · 24 hours",
    "C-1031 · Ends 4 Oct, 9:41 AM",
    "share",
  ],
  [
    "Chidi Okafor viewed your record",
    "2 Oct 2026 · 8:10 PM",
    "Current medication list",
    "Purpose: family support",
    "C-1024 · Caregiver grant to 31 Oct",
    "view",
  ],
  [
    "You revoked CityCare Clinic",
    "30 Sep 2026 · 4:20 PM",
    "Laboratory access ended immediately",
    "Reason: no longer needed · Added by you",
    "C-1018 · Revoked by patient",
    "revoke",
  ],
  [
    "HealthPlus viewed a prescription",
    "30 Sep 2026 · 11:05 AM",
    "Ferrous sulfate prescription · 28 Sep",
    "Purpose: dispensing · One-time access",
    "C-1026 · Used, now expired",
    "medicine",
  ],
  [
    "SYNLAB added your laboratory report",
    "29 Sep 2026 · 1:42 PM",
    "Full blood count · SL-290926-184",
    "Purpose: delivering your ordered test result",
    "C-1025 · Provider deposit permission",
    "add",
  ],
] as const;

const activityIcon: Record<string, (typeof icons)[keyof typeof icons]> = {
  share: icons.send,
  view: icons.activityEye,
  revoke: icons.activityShieldX,
  medicine: icons.pill,
  add: icons.files,
};

export default function RecordActivityScreen() {
  const { activeConsent, pendingConsent } = useWelli();
  const [filter, setFilter] = useState("All activity");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    hapticFeedback.success();
    setDownloading(true);
    // Demo-mode stand-in for a real PDF export job.
    await new Promise((resolve) => setTimeout(resolve, 900));
    setDownloading(false);
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Your record activity" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-1">
              {["All activity", "Last 30 days", "Filters"].map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`rounded-full border px-3 py-2 ${
                    filter === item
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={item}
                  onPress={() => setFilter(item)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filter === item ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <Guidance title="An access history you can understand">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Each entry links the recipient, selected scope, purpose,
              duration and consent. Provider additions keep their original
              source.
            </Text>
          </Guidance>

          {!activeConsent && (
            <Card>
              <Row
                detail="Today · Confirmed by you"
                icon={icons.activityShieldX}
                title="You revoked Dr Amaka Bello"
              />
              <Text className="mt-4 text-sm font-semibold text-[#173b71]">
                Future access under C-1031 ended
              </Text>
              <View className="mt-3">
                <Badge tone="red">Revoked</Badge>
              </View>
            </Card>
          )}

          {pendingConsent !== "pending" && (
            <Card>
              <Row
                detail="Today · Consent request C-1032"
                icon={icons.recordLab}
                title={`You ${pendingConsent} SYNLAB Ikeja's request`}
              />
              <Text className="mt-4 text-xs text-[#53657c]">
                {pendingConsent === "approved"
                  ? "Laboratory-only access granted for 30 days."
                  : "No record access was granted."}
              </Text>
            </Card>
          )}

          {activityItems.map(([title, date, scope, purpose, consent, icon]) => (
            <Card key={title}>
              <Row detail={date} icon={activityIcon[icon]} title={title} />
              <Text className="mt-4 text-sm font-semibold text-[#173b71]">
                {scope}
              </Text>
              <Text className="mt-2 text-xs text-[#53657c]">{purpose}</Text>
              <View className="mt-3">
                <Badge>{consent}</Badge>
              </View>
            </Card>
          ))}

          <PrimaryButton disabled={downloading} onPress={handleDownload}>
            {downloading
              ? "Preparing NDPR audit log…"
              : "Download my access history"}
          </PrimaryButton>
          <Text className="text-center text-xs text-[#53657c]">
            Questions about an access? Flag the entry for review.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
