import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  PrimaryButton,
  Row,
  ScreenStack,
  SecondaryButton,
  SectionTitle,
} from "../../components/common";
import { icons } from "../../constants/icons";
import { useGrants } from "../../hooks/useGrants";
import {
  approveGrant,
  grantDateTime,
  liveStatus,
  rejectGrant,
  scopeLabel,
  type Grant,
} from "../../services/consentService";
import { hapticFeedback } from "../../utils/haptics";

export default function ConsentExpandedScreen() {
  const { grants, loading, error, reload } = useGrants();
  const [busyId, setBusyId] = useState<string | null>(null);

  const active = grants.filter((g) => liveStatus(g) === "active");
  const pending = grants.filter((g) => g.status === "pending");
  const past = grants.filter((g) =>
    ["expired", "revoked", "rejected"].includes(liveStatus(g))
  );

  const decide = async (g: Grant, action: "approve" | "reject") => {
    setBusyId(g.id);
    try {
      if (action === "approve") await approveGrant(g.id);
      else await rejectGrant(g.id);
      action === "approve" ? hapticFeedback.success() : hapticFeedback.warning();
      await reload();
    } catch (e) {
      Alert.alert(
        "Could not save your decision",
        e instanceof Error ? e.message : "Try again."
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Share your record" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={<RefreshControl onRefresh={reload} refreshing={false} />}
      >
        <ScreenStack>
          <View className="flex-row flex-wrap gap-2">
            <Badge>{active.length} active</Badge>
            {pending.length > 0 && (
              <Badge tone="amber">{pending.length} pending</Badge>
            )}
            <Badge>{past.length} past</Badge>
          </View>

          <PrimaryButton onPress={() => router.push("/share-provider")}>
            Share with a provider
          </PrimaryButton>

          {error && (
            <Guidance title="Could not load consent" tone="amber">
              <Text className="text-[13px] leading-[1.45] text-[#936020]">
                {error} Pull down to retry.
              </Text>
            </Guidance>
          )}

          {pending.length > 0 && (
            <>
              <SectionTitle>Pending your decision</SectionTitle>
              {pending.map((g) => (
                <Card className="border-[#f6d8a7] bg-[#fbf2e3]" key={g.id}>
                  <Row
                    detail={`Requested ${grantDateTime(g.createdAt)}`}
                    icon={icons.recordStethoscope}
                    title={g.granteeName}
                  />
                  <View className="mt-4">
                    <Badge tone="amber">Pending</Badge>
                  </View>
                  <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
                    {scopeLabel(g)}
                    {g.purpose ? ` · ${g.purpose}` : ""}
                  </Text>
                  <Text className="mt-3 text-xs text-[#53657c]">
                    No access until you approve.
                  </Text>
                  <View className="mt-4 flex-row gap-3">
                    <View className="flex-1">
                      <PrimaryButton
                        disabled={busyId === g.id}
                        onPress={() => decide(g, "approve")}
                      >
                        Approve
                      </PrimaryButton>
                    </View>
                    <View className="flex-1">
                      <SecondaryButton
                        disabled={busyId === g.id}
                        onPress={() => decide(g, "reject")}
                      >
                        Reject
                      </SecondaryButton>
                    </View>
                  </View>
                </Card>
              ))}
            </>
          )}

          <SectionTitle>Active permissions</SectionTitle>
          {active.length === 0 ? (
            <Card>
              <Text className="text-sm text-[#53657c]">
                {loading
                  ? "Loading…"
                  : "No provider can view your record right now."}
              </Text>
            </Card>
          ) : (
            active.map((g) => (
              <Card key={g.id}>
                <Row
                  detail={g.granteeType === "organization" ? "Provider" : "Link"}
                  icon={icons.recordStethoscope}
                  title={g.granteeName}
                />
                <View className="mt-4">
                  <Badge>Active</Badge>
                </View>
                <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
                  {scopeLabel(g)}
                  {g.purpose ? ` · ${g.purpose}` : ""}
                </Text>
                <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                  Granted {grantDateTime(g.startsAt ?? g.createdAt)}
                  {"\n"}Expires {grantDateTime(g.expiresAt)}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  className="mt-4"
                  onPress={() =>
                    router.push({
                      pathname: "/revoke-confirm",
                      params: { id: g.id },
                    })
                  }
                >
                  <Text className="text-xs font-semibold text-[#af4540]">
                    Revoke access now
                  </Text>
                </Pressable>
              </Card>
            ))
          )}

          {past.length > 0 && (
            <>
              <SectionTitle
                action="Activity →"
                onAction={() => router.push("/record-activity")}
              >
                Past access
              </SectionTitle>
              {past.slice(0, 5).map((g) => {
                const status = liveStatus(g);
                return (
                  <Card key={g.id}>
                    <Row
                      detail={scopeLabel(g)}
                      icon={icons.recordStethoscope}
                      title={g.granteeName}
                    />
                    <View className="mt-3">
                      <Badge tone={status === "expired" ? "blue" : "red"}>
                        {status === "expired"
                          ? "Expired"
                          : status === "revoked"
                            ? "Revoked"
                            : "Rejected"}
                      </Badge>
                    </View>
                  </Card>
                );
              })}
            </>
          )}

          <Guidance title="Revocation ends future access">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              It cannot undo a past view or erase records a provider must
              legally retain.
            </Text>
          </Guidance>

          <SecondaryButton onPress={() => router.push("/record-activity")}>
            Consent history
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
