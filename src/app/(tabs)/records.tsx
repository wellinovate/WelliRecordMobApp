import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  RefreshControl,
} from "react-native";
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
import { useRecords } from "../../hooks/useRecords";
import { labDate, labValue } from "../../services/labService";
import { dosageText, isCurrent } from "../../services/medicationService";

const plural = (n: number, one: string, many: string) =>
  `${n} ${n === 1 ? one : many}`;

export default function RecordsScreen() {
  const { recordAdded } = useWelli();
  const { labs, vitals, medications, loading, refreshing, error, refresh } =
    useRecords();
  const [searchQuery, setSearchQuery] = useState("");

  const currentMeds = medications.filter(isCurrent).length;
  const timelineCount = labs.length + vitals.length + medications.length;

  // Only categories that have a data source behind them are listed.
  const categories = [
    {
      icon: icons.stethoscope,
      label: "Timeline",
      count: plural(timelineCount, "entry", "entries"),
      target: "/timeline",
    },
    {
      icon: icons.lab,
      label: "Laboratory",
      count: plural(labs.length, "report", "reports"),
      target: "/reports",
    },
    {
      icon: icons.pill,
      label: "Medications",
      count: `${currentMeds} current`,
      target: "/medications",
    },
    {
      icon: icons.activity,
      label: "Vitals",
      count: plural(vitals.length, "reading", "readings"),
      target: "/vitals",
    },
  ] as const;

  const q = searchQuery.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return null;
    const labHits = labs
      .filter(
        (l) =>
          l.testName.toLowerCase().includes(q) ||
          (l.organizationName ?? "").toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((l) => ({
        key: `lab-${l._id}`,
        icon: icons.lab,
        title: l.testName,
        detail: [labDate(l), l.organizationName, labValue(l)]
          .filter(Boolean)
          .join(" · "),
        onPress: () =>
          router.push({ pathname: "/result", params: { id: l._id } }),
      }));
    const medHits = medications
      .filter(
        (m) =>
          m.medicationName.toLowerCase().includes(q) ||
          (m.genericName ?? "").toLowerCase().includes(q) ||
          (m.organizationName ?? "").toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((m) => ({
        key: `med-${m._id}`,
        icon: icons.pill,
        title: m.medicationName,
        detail: [dosageText(m), m.frequency, m.organizationName]
          .filter(Boolean)
          .join(" · "),
        onPress: () => router.push("/medications"),
      }));
    return [...labHits, ...medHits];
  }, [q, labs, medications]);

  return (
    <View className="flex-1 bg-white">
      <Header
        onRightAction={() => router.push("/(tabs)/profile")}
        rightAction="avatar"
        title="My health records"
      />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={
          <RefreshControl onRefresh={refresh} refreshing={refreshing} />
        }
      >
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

          {matches && (
            <>
              <SectionTitle>
                {matches.length === 0
                  ? "No matches"
                  : plural(matches.length, "match", "matches")}
              </SectionTitle>
              {matches.map((m) => (
                <Card key={m.key} onPress={m.onPress}>
                  <Row detail={m.detail} icon={m.icon} title={m.title} />
                </Card>
              ))}
            </>
          )}

          {!matches && (
            <>
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

              {error && (
                <Guidance title="Some records could not be loaded" tone="amber">
                  <Text className="text-[13px] leading-[1.45] text-[#936020]">
                    {error} Pull down to try again.
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
                <Card
                  className="flex-1 p-4"
                  onPress={() => router.push("/health-passport")}
                >
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
                {categories.map((c) => (
                  <Card
                    className="min-h-[124px] w-[47%] p-4"
                    key={c.label}
                    onPress={() => router.push(c.target as any)}
                  >
                    <Icon src={c.icon} />
                    <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                      {c.label}
                    </Text>
                    <Text className="mt-1 text-xs text-[#53657c]">
                      {loading ? "Loading..." : c.count}
                    </Text>
                  </Card>
                ))}
              </View>
              {!loading && (
                <Text className="text-xs text-[#53657c]">
                  Imaging, vaccinations, allergies and procedures are not shown
                  here yet.
                </Text>
              )}

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
                  detail="Review a preserved local upload draft"
                  icon={icons.cloudOff}
                  onPress={() => router.push("/upload-failed")}
                  title="Interrupted upload"
                />
              </Card>
            </>
          )}
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
