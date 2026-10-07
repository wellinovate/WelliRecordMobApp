import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
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
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../components/common";
import { icons } from "../constants/icons";
import {
  fetchLabs,
  labDate,
  labFlag,
  labRange,
  labSource,
  labValue,
  type LabResult,
} from "../services/labService";

export default function ReportsScreen() {
  const [labs, setLabs] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setLabs(await fetchLabs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load results.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load("initial");
  }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      labs.filter(
        (l) =>
          !q ||
          l.testName.toLowerCase().includes(q) ||
          (l.category ?? "").toLowerCase().includes(q) ||
          labDate(l).toLowerCase().includes(q)
      ),
    [labs, q]
  );

  // The server returns newest first. The latest card only shows when the
  // person is not searching, so a search never hides its own best match.
  const showLatest = !q && filtered.length > 0;
  const latest = showLatest ? filtered[0] : null;
  const earlier = showLatest ? filtered.slice(1) : filtered;
  const latestFlag = latest ? labFlag(latest) : null;
  const latestRange = latest ? labRange(latest) : null;

  const open = (lab: LabResult) =>
    router.push({ pathname: "/result", params: { id: lab._id } });

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Lab results" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={
          <RefreshControl
            onRefresh={() => load("refresh")}
            refreshing={refreshing}
          />
        }
      >
        <ScreenStack>
          <View className="h-[52px] flex-row items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm">
            <Icon src={icons.search} />
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setSearch}
              placeholder="Search a test or date"
              placeholderTextColor="#718096"
              value={search}
            />
            {search.length > 0 && (
              <Pressable accessibilityRole="button" onPress={() => setSearch("")}>
                <Text className="text-xs text-[#718096]">Clear</Text>
              </Pressable>
            )}
          </View>

          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
              <Text className="mt-3 text-xs text-[#53657c]">
                Loading your results...
              </Text>
            </View>
          )}

          {!loading && error && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Could not load results
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                {error}
              </Text>
              <View className="mt-4">
                <SecondaryButton onPress={() => load("initial")}>
                  Try again
                </SecondaryButton>
              </View>
            </Card>
          )}

          {!loading && !error && labs.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                No lab results yet
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                Results your provider submits to WelliRecord appear here.
              </Text>
            </Card>
          )}

          {!loading && !error && labs.length > 0 && (
            <View className="flex-row justify-between">
              <Text className="text-sm font-semibold text-[#031f50]">
                {filtered.length} {filtered.length === 1 ? "report" : "reports"}
              </Text>
              <Text className="text-sm font-semibold text-[#031f50]">
                Newest first
              </Text>
            </View>
          )}

          {!loading && latest && (
            <Card onPress={() => open(latest)}>
              <View className="flex-row justify-between">
                <Text className="text-[11px] font-semibold text-[#173b71]">
                  LATEST REPORT
                </Text>
                <Text className="text-[11px] font-semibold text-[#173b71]">
                  {labSource(latest)}
                </Text>
              </View>
              <Text className="mt-3 text-lg font-bold text-[#031f50]">
                {latest.testName}
              </Text>
              <Text className="mt-1 text-xs text-[#53657c]">
                {labDate(latest)}
                {latest.specimen ? ` · ${latest.specimen}` : ""}
              </Text>
              <View
                className={`mt-4 rounded-xl p-3 ${
                  latestFlag?.tone === "red"
                    ? "bg-[#faedea]"
                    : latestFlag?.tone === "amber"
                      ? "bg-[#fbf2e3]"
                      : "bg-[#edf2fa]"
                }`}
              >
                <Text className="text-sm font-semibold text-[#031f50]">
                  {labValue(latest)}
                </Text>
                {latestRange && (
                  <Text className="mt-2 text-xs text-[#53657c]">
                    Reference range: {latestRange}
                  </Text>
                )}
                {latestFlag && (
                  <View className="mt-2">
                    <Badge tone={latestFlag.tone}>{latestFlag.label}</Badge>
                  </View>
                )}
              </View>
              <View className="mt-4">
                <PrimaryButton onPress={() => open(latest)}>
                  Open latest report
                </PrimaryButton>
              </View>
            </Card>
          )}

          {!loading && earlier.length > 0 && (
            <>
              <SectionTitle>
                {showLatest ? "Earlier reports" : "Results"}
              </SectionTitle>
              {earlier.map((lab) => {
                const flag = labFlag(lab);
                return (
                  <Card className="p-4" key={lab._id} onPress={() => open(lab)}>
                    <Text className="text-sm font-semibold text-[#031f50]">
                      {lab.testName}
                    </Text>
                    <Text className="mt-1 text-xs text-[#53657c]">
                      {labDate(lab)}
                    </Text>
                    <Text className="mt-3 text-xs text-[#53657c]">
                      {labValue(lab)}
                    </Text>
                    <View className="mt-3 flex-row gap-2">
                      <Badge>{labSource(lab)}</Badge>
                      {flag && <Badge tone={flag.tone}>{flag.label}</Badge>}
                    </View>
                  </Card>
                );
              })}
            </>
          )}

          {!loading && !error && labs.length > 0 && filtered.length === 0 && (
            <Text className="text-xs text-[#53657c]">
              Nothing matches that search.
            </Text>
          )}

          <Guidance title="Source labels, not a medical assessment">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Labels show who submitted a result and the range the provider
              recorded. They are not a diagnosis.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
