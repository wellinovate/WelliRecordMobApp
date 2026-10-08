import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
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
  liveStatus,
  revokeGrant,
  scopeLabel,
  type Grant,
} from "../services/consentService";
import { hapticFeedback } from "../utils/haptics";

export default function RevokeConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [grant, setGrant] = useState<Grant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGrants()
      .then((all) => setGrant(all.find((g) => g.id === id) ?? null))
      .catch(() => setGrant(null))
      .finally(() => setLoading(false));
  }, [id]);

  const confirm = async () => {
    if (!grant) return;
    setSaving(true);
    try {
      await revokeGrant(grant.id);
      hapticFeedback.warning();
      router.replace("/(tabs)/consent-expanded");
    } catch (e) {
      Alert.alert(
        "Could not revoke",
        e instanceof Error ? e.message : "Try again."
      );
      setSaving(false);
    }
  };

  const canRevoke =
    !!grant && ["active", "pending"].includes(liveStatus(grant));

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Review consent" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          {loading ? (
            <ActivityIndicator />
          ) : !grant ? (
            <Guidance title="Consent not found" tone="amber">
              <Text className="text-[13px] leading-[1.45] text-[#936020]">
                This access may already have ended.
              </Text>
            </Guidance>
          ) : (
            <>
              <View className="items-center rounded-[20px] bg-[#faedea] p-[22px]">
                <View className="size-[60px] items-center justify-center rounded-full bg-[#af4540]">
                  <Icon size={28} src={icons.revoke} />
                </View>
                <Text className="mt-3 text-center text-[22px] font-bold leading-[1.3] text-[#031f50]">
                  End future access
                </Text>
                <Text className="mt-3 text-center text-sm leading-[1.45] text-[#53657c]">
                  This applies to {grant.granteeName} only.
                </Text>
              </View>

              <Card>
                <Badge>
                  {liveStatus(grant) === "active" ? "Active" : "Pending"}
                </Badge>
                <Text className="mt-4 text-sm font-semibold text-[#031f50]">
                  {grant.granteeName}
                </Text>
                <Text className="mt-3 text-sm leading-[1.45] text-[#173b71]">
                  {scopeLabel(grant)}
                </Text>
                <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                  Granted {grantDateTime(grant.startsAt ?? grant.createdAt)}
                  {grant.expiresAt
                    ? `\nExpires ${grantDateTime(grant.expiresAt)}`
                    : ""}
                </Text>
              </Card>

              <Guidance title="What revocation means" tone="amber">
                <Text className="text-[13px] leading-[1.45] text-[#936020]">
                  Future access ends as soon as this is saved. Past views
                  cannot be undone.
                </Text>
              </Guidance>

              <PrimaryButton
                danger
                disabled={saving || !canRevoke}
                onPress={confirm}
              >
                {saving ? "Revoking…" : "Confirm revoke"}
              </PrimaryButton>
            </>
          )}
          <SecondaryButton onPress={() => router.back()}>
            {grant ? "Cancel · Keep access" : "Back"}
          </SecondaryButton>
          <Text className="text-center text-xs text-[#53657c]">
            Restoring access requires a new consent choice.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
