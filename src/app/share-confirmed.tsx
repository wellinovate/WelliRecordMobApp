import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Icon,
  PrimaryButton,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";
import {
  fetchGrants,
  grantDateTime,
  scopeLabel,
  type Grant,
} from "../services/consentService";

export default function ShareConfirmedScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrants()
      .then((all) => setGrant(all.find((g) => g.id === id) ?? null))
      .catch(() => setGrant(null))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Consent confirmed" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <>
              <View className="items-center rounded-[20px] bg-[#edf2fa] p-[22px]">
                <View className="size-[60px] items-center justify-center rounded-full bg-[#031f50]">
                  <Icon size={28} src={icons.success} />
                </View>
                <Text className="mt-3 text-center text-[22px] font-bold leading-[1.3] text-[#031f50]">
                  {grant ? `Shared with ${grant.granteeName}` : "Consent saved"}
                </Text>
                <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
                  They can view the selected records until the expiry time.
                </Text>
              </View>

              {grant && (
                <Card>
                  <Badge>Active</Badge>
                  <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
                    {scopeLabel(grant)}
                  </Text>
                  <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                    Granted {grantDateTime(grant.startsAt ?? grant.createdAt)}
                    {"\n"}Expires {grantDateTime(grant.expiresAt)}
                  </Text>
                </Card>
              )}

              <Guidance title="You stay in control">
                <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                  You can revoke this at any time in the consent screen.
                </Text>
              </Guidance>
            </>
          )}

          <PrimaryButton onPress={() => router.replace("/(tabs)/consent-expanded")}>
            View consent
          </PrimaryButton>
          <SecondaryButton onPress={() => router.replace("/(tabs)/home")}>
            Back to home
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
