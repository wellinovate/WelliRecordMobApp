import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
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
import {
  clockLabel,
  dosageText,
  fetchMedications,
  isCurrent,
  takenToday,
  toggleTakenToday,
  type MedicationEntry,
} from "../services/medicationService";
import { hapticFeedback } from "../utils/haptics";

function shortDate(raw?: string | null): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function MedicationsScreen() {
  const [activeTab, setActiveTab] = useState<"current" | "past">("current");
  const [meds, setMeds] = useState<MedicationEntry[]>([]);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [list, log] = await Promise.all([fetchMedications(), takenToday()]);
      setMeds(list);
      setTaken(log);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load medications."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load("initial");
  }, [load]);

  const current = useMemo(() => meds.filter(isCurrent), [meds]);
  const past = useMemo(() => meds.filter((m) => !isCurrent(m)), [meds]);
  const shown = activeTab === "current" ? current : past;
  const takenCount = current.filter((m) => taken.has(m._id)).length;

  const handleToggle = async (id: string) => {
    hapticFeedback.light();
    setTaken(await toggleTakenToday(id));
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Medications" />
      <ScrollView
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
          <View className="flex-row rounded-[14px] bg-[#edf2fa] p-1">
            {(["current", "past"] as const).map((tab) => (
              <Pressable
                accessibilityRole="button"
                className={`flex-1 rounded-[11px] py-2.5 ${
                  activeTab === tab ? "bg-white shadow-sm" : ""
                }`}
                key={tab}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  className={`text-center text-xs font-semibold ${
                    activeTab === tab ? "text-[#031f50]" : "text-[#53657c]"
                  }`}
                >
                  {tab === "current" ? "Current" : "Past"} ·{" "}
                  {tab === "current" ? current.length : past.length}
                </Text>
              </Pressable>
            ))}
          </View>

          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
            </View>
          )}

          {!loading && error && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Could not load medications
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

          {!loading && !error && activeTab === "current" && current.length > 0 && (
            <Card className="bg-[#edf2fa]">
              <View className="flex-row items-center justify-between">
                <Text className="text-[15px] font-semibold text-[#031f50]">
                  Today
                </Text>
                <Text className="text-[11px] font-semibold text-[#031f50]">
                  {takenCount} of {current.length} marked taken
                </Text>
              </View>
              <Text className="mt-2 text-[11px] text-[#53657c]">
                Self-reported on this device, not proof of use.
              </Text>
            </Card>
          )}

          {!loading && !error && shown.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                {activeTab === "current"
                  ? "No current medications"
                  : "No past medications"}
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                Medications your provider or pharmacy records appear here.
              </Text>
            </Card>
          )}

          {!loading &&
            shown.map((m) => {
              const dose = dosageText(m);
              const start = shortDate(m.startDate ?? m.prescribedAt);
              const end = shortDate(m.endDate);
              const isTaken = taken.has(m._id);
              const times = m.scheduleTimes ?? [];
              const details = [
                m.form && m.form !== "other" ? cap(m.form) : null,
                m.route && m.route !== "oral" && m.route !== "other"
                  ? m.route.toUpperCase()
                  : null,
                m.frequency,
                m.duration,
              ].filter(Boolean);
              return (
                <Card key={m._id}>
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 flex-row gap-3">
                      <Icon src={icons.pill} />
                      <View className="flex-1">
                        <Text className="text-lg font-bold text-[#031f50]">
                          {m.medicationName}
                          {dose ? ` · ${dose}` : ""}
                        </Text>
                        {m.genericName && m.genericName !== m.medicationName && (
                          <Text className="mt-1 text-xs text-[#53657c]">
                            {m.genericName}
                          </Text>
                        )}
                      </View>
                    </View>
                    {m.medicationStatus && m.medicationStatus !== "active" && (
                      <Badge tone="amber">
                        {cap(m.medicationStatus.replace("-", " "))}
                      </Badge>
                    )}
                  </View>

                  {details.length > 0 && (
                    <Text className="mt-3 text-sm leading-[1.45] text-[#173b71]">
                      {details.join(" · ")}
                    </Text>
                  )}
                  {m.indication && (
                    <Text className="mt-2 text-xs text-[#53657c]">
                      For: {m.indication}
                    </Text>
                  )}
                  {(m.organizationName || start || end) && (
                    <Text className="mt-2 text-xs text-[#53657c]">
                      {[
                        m.organizationName ? `Prescribed by ${m.organizationName}` : null,
                        start ? `From ${start}` : null,
                        end ? `to ${end}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </Text>
                  )}
                  {times.length > 0 && (
                    <View className="mt-3 flex-row flex-wrap gap-2">
                      {times.map((t) => (
                        <Badge key={t}>{clockLabel(t)}</Badge>
                      ))}
                    </View>
                  )}
                  <View className="mt-3">
                    <Badge>
                      {m.source === "patient" ? "Patient Added" : "Verified prescription"}
                    </Badge>
                  </View>

                  {activeTab === "current" && (
                    <Pressable
                      accessibilityRole="button"
                      className={`mt-4 h-12 items-center justify-center rounded-xl active:scale-[0.98] ${
                        isTaken ? "bg-[#edf2fa]" : "bg-[#031f50]"
                      }`}
                      onPress={() => handleToggle(m._id)}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isTaken ? "text-[#031f50]" : "text-white"
                        }`}
                      >
                        {isTaken ? "Undo taken today" : "✓  Mark taken today"}
                      </Text>
                    </Pressable>
                  )}
                </Card>
              );
            })}

          <Guidance title="Safety information, not prescribing advice" tone="amber">
            <Text className="text-[13px] leading-[1.45] text-[#936020]">
              Ask your clinician or pharmacist before starting, stopping or
              changing any medicine.
            </Text>
          </Guidance>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
