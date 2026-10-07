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
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Icon,
  PrimaryButton,
  ScreenStack,
  SectionTitle,
  SecondaryButton,
} from "../../components/common";
import { icons } from "../../constants/icons";
import { fetchProviders, type Provider } from "../../services/providerService";

const ALL = "All providers";
const VERIFIED = "Verified";

export default function CareDiscoveryScreen() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState(ALL);
  const [search, setSearch] = useState("");

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      setProviders(await fetchProviders());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load providers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load("initial");
  }, [load]);

  // Filter chips come from the data: the types providers registered as.
  const filters = useMemo(() => {
    const types = Array.from(
      new Set(providers.map((p) => p.type).filter((t): t is string => !!t))
    ).sort();
    return [ALL, VERIFIED, ...types];
  }, [providers]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return providers.filter((p) => {
      if (filter === VERIFIED && !p.isVerified) return false;
      if (filter !== ALL && filter !== VERIFIED && p.type !== filter)
        return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.type ?? "").toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    });
  }, [providers, filter, search]);

  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Find care" />
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
              placeholder="Search a hospital, clinic or lab"
              placeholderTextColor="#718096"
              value={search}
            />
          </View>

          {filters.length > 2 && (
            <View className="flex-row flex-wrap gap-2">
              {filters.map((item) => (
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
                    className={`text-[11px] font-semibold ${
                      filter === item ? "text-white" : "text-[#031f50]"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <SectionTitle>
            {loading ? "Providers" : `Providers (${visible.length})`}
          </SectionTitle>

          {loading && (
            <View className="items-center py-10">
              <ActivityIndicator color="#031f50" />
              <Text className="mt-3 text-xs text-[#53657c]">
                Loading providers...
              </Text>
            </View>
          )}

          {!loading && error && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                Could not load providers
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

          {!loading && !error && visible.length === 0 && (
            <Card>
              <Text className="text-sm font-semibold text-[#031f50]">
                No providers found
              </Text>
              <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                {providers.length === 0
                  ? "No providers have joined yet."
                  : "Nothing matches that search or filter."}
              </Text>
            </Card>
          )}

          {!loading &&
            visible.map((provider) => (
              <Card className="shadow-sm" key={provider.id}>
                <Text className="text-lg font-bold text-[#031f50]">
                  {provider.name}
                </Text>
                {(provider.type || provider.address) && (
                  <Text className="mt-2 text-xs leading-[1.45] text-[#53657c]">
                    {[provider.type, provider.address]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                )}
                {provider.isVerified && (
                  <View className="mt-3 flex-row gap-2">
                    <Badge>Verified on WelliRecord</Badge>
                  </View>
                )}
                <View className="mt-4">
                  <PrimaryButton
                    onPress={() =>
                      router.push({
                        pathname: "/booking-time",
                        params: {
                          facilityId: provider.id,
                          facilityName: provider.name,
                          facilityAddress: provider.address,
                        },
                      })
                    }
                  >
                    Book an appointment
                  </PrimaryButton>
                </View>
              </Card>
            ))}

          <Text className="text-xs leading-[1.45] text-[#53657c]">
            Coverage may require HMO authorization. Confirm eligibility and
            opening times with the provider.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
