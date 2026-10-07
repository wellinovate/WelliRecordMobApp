import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../components/common";
import { useRecords } from "../hooks/useRecords";
import {
  vitalDate,
  vitalReadings,
  vitalSourceLabel,
  type VitalEntry,
} from "../services/vitalService";

function when(v: VitalEntry): string {
  const d = vitalDate(v);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}

function VitalCard({ v, latest }: { v: VitalEntry; latest?: boolean }) {
  const readings = vitalReadings(v);
  return (
    <Card>
      {latest && (
        <Text className="text-[11px] font-semibold text-[#173b71]">
          LATEST READING
        </Text>
      )}
      <Text className="mt-1 text-sm font-semibold text-[#031f50]">{when(v)}</Text>
      {v.organizationName && (
        <Text className="mt-1 text-xs text-[#53657c]">{v.organizationName}</Text>
      )}
      <View className="mt-3 gap-2">
        {readings.length === 0 && (
          <Text className="text-xs text-[#53657c]">No measurements recorded.</Text>
        )}
        {readings.map((r) => (
          <View className="flex-row justify-between" key={r.label}>
            <Text className="text-xs text-[#53657c]">{r.label}</Text>
            <Text className="text-sm font-semibold text-[#031f50]">{r.value}</Text>
          </View>
        ))}
      </View>
      <View className="mt-3">
        <Badge>{vitalSourceLabel(v)}</Badge>
      </View>
    </Card>
  );
}

export default function VitalsScreen() {
  const { vitals, loading, refreshing, error, refresh } = useRecords();
  const sorted = useMemo(
    () => [...vitals].sort((a, b) => +vitalDate(b) - +vitalDate(a)),
    [vitals]
  );

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Vitals" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={refreshing} />
        }
      >
        <ScreenStack>
          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
            </View>
          )}

          {!loading && error && sorted.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Could not load vitals
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                {error}
              </Text>
              <View className="mt-4">
                <SecondaryButton onPress={refresh}>Try again</SecondaryButton>
              </View>
            </Card>
          )}

          {!loading && !error && sorted.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                No vitals yet
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                Blood pressure, heart rate and other measurements your provider
                records appear here.
              </Text>
            </Card>
          )}

          {sorted.length > 0 && (
            <>
              <VitalCard latest v={sorted[0]} />
              {sorted.length > 1 && <SectionTitle>Earlier readings</SectionTitle>}
              {sorted.slice(1).map((v) => (
                <VitalCard key={v._id} v={v} />
              ))}
            </>
          )}

          <Guidance title="Measurements, not a medical assessment">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Values are shown as recorded. Your clinician interprets them with
              your history.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
