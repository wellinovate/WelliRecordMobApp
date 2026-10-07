import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import { useRecords } from "../hooks/useRecords";
import { labFlag, labRange, labValue } from "../services/labService";
import { dosageText } from "../services/medicationService";
import {
  vitalDate,
  vitalReadings,
  vitalSourceLabel,
} from "../services/vitalService";

type Kind = "lab" | "medication" | "vitals";

interface TimelineEvent {
  key: string;
  kind: Kind;
  date: Date;
  title: string;
  source: string | null;
  detail: string;
  badge: string;
  onPress: () => void;
}

const FILTERS: Array<{ label: string; kind: Kind | null }> = [
  { label: "All records", kind: null },
  { label: "Labs", kind: "lab" },
  { label: "Medications", kind: "medication" },
  { label: "Vitals", kind: "vitals" },
];

const KIND_ICON = {
  lab: icons.lab,
  medication: icons.pill,
  vitals: icons.activity,
} as const;

const fmt = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function TimelineScreen() {
  const { labs, vitals, medications, loading, refreshing, error, refresh } =
    useRecords();
  const [filter, setFilter] = useState<Kind | null>(null);

  const events = useMemo<TimelineEvent[]>(() => {
    const out: TimelineEvent[] = [];
    for (const l of labs) {
      const range = labRange(l);
      const flag = labFlag(l);
      out.push({
        key: `lab-${l._id}`,
        kind: "lab",
        date: new Date(l.resultedAt ?? l.collectedAt ?? l.createdAt),
        title: l.testName,
        source: l.organizationName ?? null,
        detail: [
          labValue(l),
          range ? `Reference: ${range}` : null,
          flag?.label ?? null,
        ]
          .filter(Boolean)
          .join(" · "),
        badge: l.verificationStatus === "verified" ? "Verified provider" : "Provider submitted",
        onPress: () => router.push({ pathname: "/result", params: { id: l._id } }),
      });
    }
    for (const m of medications) {
      out.push({
        key: `med-${m._id}`,
        kind: "medication",
        date: new Date(m.prescribedAt ?? m.startDate ?? m.createdAt),
        title: `${m.medicationStatus === "completed" ? "Medication" : "Prescription"}: ${m.medicationName}`,
        source: m.organizationName ?? null,
        detail: [dosageText(m), m.frequency, m.duration].filter(Boolean).join(" · ") || "Details not recorded",
        badge: m.source === "patient" ? "Patient Added" : "Verified prescription",
        onPress: () => router.push("/medications"),
      });
    }
    for (const v of vitals) {
      const readings = vitalReadings(v);
      out.push({
        key: `vit-${v._id}`,
        kind: "vitals",
        date: vitalDate(v),
        title: "Vitals recorded",
        source: v.organizationName ?? null,
        detail:
          readings
            .slice(0, 3)
            .map((r) => `${r.label} ${r.value}`)
            .join(" · ") || "No measurements recorded",
        badge: vitalSourceLabel(v),
        onPress: () => router.push("/vitals"),
      });
    }
    return out
      .filter((e) => !Number.isNaN(e.date.getTime()))
      .sort((a, b) => +b.date - +a.date);
  }, [labs, vitals, medications]);

  const shown = filter ? events.filter((e) => e.kind === filter) : events;

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Timeline" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={refreshing} />
        }
      >
        <ScreenStack>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-2 pb-1">
              {FILTERS.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`rounded-full border px-3 py-2 ${
                    filter === item.kind
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={item.label}
                  onPress={() => setFilter(item.kind)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      filter === item.kind ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
            </View>
          )}

          {!loading && error && events.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Could not load your timeline
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                {error}
              </Text>
              <View className="mt-4">
                <SecondaryButton onPress={refresh}>Try again</SecondaryButton>
              </View>
            </Card>
          )}

          {!loading && !error && shown.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Nothing here yet
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                Results, medications and vitals recorded by your providers
                appear here, newest first.
              </Text>
            </Card>
          )}

          <View className="gap-3">
            {shown.map((e, index) => (
              <View className="flex-row gap-2" key={e.key}>
                <View className="w-[30px] items-center">
                  <View className="size-7 items-center justify-center rounded-full bg-[#edf2fa]">
                    <Icon size={15} src={KIND_ICON[e.kind]} />
                  </View>
                  {index < shown.length - 1 && (
                    <View className="mt-1 w-0.5 flex-1 bg-[#dae2ee]" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="mb-2 text-[11px] font-semibold text-[#53657c]">
                    {fmt(e.date)}
                  </Text>
                  <Card className="mb-1 p-4" onPress={e.onPress}>
                    <Text className="text-sm font-semibold text-[#031f50]">
                      {e.title}
                    </Text>
                    {e.source && (
                      <Text className="mt-2 text-xs text-[#53657c]">
                        {e.source}
                      </Text>
                    )}
                    <Text className="mt-3 text-xs leading-[1.45] text-[#173b71]">
                      {e.detail}
                    </Text>
                    <View className="mt-3">
                      <Badge>{e.badge}</Badge>
                    </View>
                  </Card>
                </View>
              </View>
            ))}
          </View>

          <Guidance title="Your own symptoms and measurements are Patient Added">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              They never silently rewrite this history.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
