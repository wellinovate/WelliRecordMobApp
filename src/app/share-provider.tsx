import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Guidance,
  PrimaryButton,
  ScreenStack,
  SectionTitle,
} from "../components/common";
import { fetchProviders, type Provider } from "../services/providerService";
import {
  CATEGORY_OPTIONS,
  DURATION_OPTIONS,
  createGrant,
} from "../services/consentService";
import { hapticFeedback } from "../utils/haptics";

function Option({
  label,
  detail,
  selected,
  onPress,
}: {
  label: string;
  detail?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      className={`rounded-[14px] border px-4 py-3 active:opacity-80 ${
        selected ? "border-[#031f50] bg-[#edf2fa]" : "border-[#dae2ee] bg-white"
      }`}
      onPress={onPress}
    >
      <Text className="text-sm font-semibold text-[#031f50]">{label}</Text>
      {!!detail && (
        <Text className="mt-1 text-xs text-[#53657c]">{detail}</Text>
      )}
    </Pressable>
  );
}

export default function ShareProviderScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);
  const [scope, setScope] = useState<"full-record" | "category">("category");
  const [category, setCategory] = useState("lab-results");
  const [days, setDays] = useState(7);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProviders()
      .then(setProviders)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(
    () => providers.find((p) => p.id === providerId) ?? null,
    [providers, providerId]
  );

  const submit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const grant = await createGrant({
        granteeOrganizationId: selected.id,
        accessScope: scope,
        category: scope === "category" ? category : undefined,
        durationDays: days,
      });
      hapticFeedback.success();
      router.replace({ pathname: "/share-confirmed", params: { id: grant.id } });
    } catch (e) {
      Alert.alert(
        "Could not share",
        e instanceof Error ? e.message : "Try again."
      );
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Share with a provider" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <SectionTitle>Provider</SectionTitle>
          {loading ? (
            <ActivityIndicator />
          ) : loadError ? (
            <Guidance title="Could not load providers" tone="amber">
              <Text className="text-[13px] leading-[1.45] text-[#936020]">
                Check your connection and open this screen again.
              </Text>
            </Guidance>
          ) : providers.length === 0 ? (
            <Card>
              <Text className="text-sm text-[#53657c]">
                No participating providers yet.
              </Text>
            </Card>
          ) : (
            <View className="gap-2">
              {providers.map((p) => (
                <Option
                  detail={[p.type, p.address].filter(Boolean).join(" · ")}
                  key={p.id}
                  label={p.name}
                  onPress={() => setProviderId(p.id)}
                  selected={providerId === p.id}
                />
              ))}
            </View>
          )}

          <SectionTitle>What they can see</SectionTitle>
          <View className="gap-2">
            <Option
              detail="Everything in your record"
              label="Full record"
              onPress={() => setScope("full-record")}
              selected={scope === "full-record"}
            />
            <Option
              detail="Pick one category"
              label="One category"
              onPress={() => setScope("category")}
              selected={scope === "category"}
            />
          </View>
          {scope === "category" && (
            <View className="flex-row flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((c) => (
                <Pressable
                  accessibilityRole="radio"
                  accessibilityState={{ selected: category === c.value }}
                  className={`rounded-full border px-3 py-2 ${
                    category === c.value
                      ? "border-[#031f50] bg-[#031f50]"
                      : "border-[#dae2ee] bg-white"
                  }`}
                  key={c.value}
                  onPress={() => setCategory(c.value)}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      category === c.value ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {c.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <SectionTitle>For how long</SectionTitle>
          <View className="gap-2">
            {DURATION_OPTIONS.map((d) => (
              <Option
                key={d.days}
                label={d.label}
                onPress={() => setDays(d.days)}
                selected={days === d.days}
              />
            ))}
          </View>

          <Guidance title="View only">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              The provider can view, not change, what you share. You can
              revoke it at any time.
            </Text>
          </Guidance>

          <PrimaryButton disabled={!selected || saving} onPress={submit}>
            {saving ? "Sharing…" : "Share"}
          </PrimaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
