import React, { useMemo } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { Header } from "../components/navigation/Header";
import {
  Badge,
  Card,
  Guidance,
  Row,
  ScreenStack,
} from "../components/common";
import { icons } from "../constants/icons";
import { useGrants } from "../hooks/useGrants";
import {
  grantDateTime,
  liveStatus,
  scopeLabel,
  type Grant,
} from "../services/consentService";

interface Entry {
  key: string;
  at: string;
  title: string;
  detail: string;
  icon: (typeof icons)[keyof typeof icons];
}

// The activity list is built from consent changes the server records on each
// grant. Provider views are not logged by the backend yet, so none appear.
function entriesFor(g: Grant): Entry[] {
  const out: Entry[] = [];
  const scope = scopeLabel(g);
  out.push({
    key: `${g.id}-created`,
    at: g.createdAt,
    title: g.requestedByProvider
      ? `${g.granteeName} requested access`
      : `You shared with ${g.granteeName}`,
    detail: scope,
    icon: icons.send,
  });
  if (g.reviewedAt && g.requestedByProvider) {
    out.push({
      key: `${g.id}-reviewed`,
      at: g.reviewedAt,
      title:
        g.status === "rejected"
          ? `You rejected ${g.granteeName}`
          : `You approved ${g.granteeName}`,
      detail: g.rejectionReason ?? scope,
      icon: icons.recordLab,
    });
  }
  if (g.revokedAt) {
    out.push({
      key: `${g.id}-revoked`,
      at: g.revokedAt,
      title: `You revoked ${g.granteeName}`,
      detail: "Future access ended",
      icon: icons.activityShieldX,
    });
  } else if (liveStatus(g) === "expired" && g.expiresAt) {
    out.push({
      key: `${g.id}-expired`,
      at: g.expiresAt,
      title: `Access for ${g.granteeName} expired`,
      detail: scope,
      icon: icons.pill,
    });
  }
  return out;
}

export default function RecordActivityScreen() {
  const { grants, loading, error, reload } = useGrants();

  const entries = useMemo(
    () =>
      grants
        .flatMap(entriesFor)
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [grants]
  );

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Your record activity" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
        refreshControl={<RefreshControl onRefresh={reload} refreshing={false} />}
      >
        <ScreenStack>
          <Guidance title="Consent history">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Each entry is a consent change: shared, requested, approved,
              rejected, revoked or expired.
            </Text>
          </Guidance>

          {error && (
            <Guidance title="Could not load activity" tone="amber">
              <Text className="text-[13px] leading-[1.45] text-[#936020]">
                {error} Pull down to retry.
              </Text>
            </Guidance>
          )}

          {!loading && !error && entries.length === 0 && (
            <Card>
              <Text className="text-sm text-[#53657c]">
                No consent activity yet.
              </Text>
            </Card>
          )}

          {entries.map((e) => (
            <Card key={e.key}>
              <Row detail={grantDateTime(e.at)} icon={e.icon} title={e.title} />
              <Text className="mt-4 text-sm font-semibold text-[#173b71]">
                {e.detail}
              </Text>
            </Card>
          ))}
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
