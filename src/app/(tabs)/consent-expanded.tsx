import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
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
import { useWelli } from "../../state/WelliContext";

export default function ConsentExpandedScreen() {
  const { activeConsent, pendingConsent, approveConsent, rejectConsent } =
    useWelli();

  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Share your record" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <View className="flex-row flex-wrap gap-2">
            <Badge>{activeConsent ? "2 active" : "1 active"}</Badge>
            {pendingConsent === "pending" && <Badge tone="amber">1 pending</Badge>}
            <Badge>{activeConsent ? "3 expired" : "4 expired"}</Badge>
          </View>

          <SectionTitle>Active permissions</SectionTitle>
          {activeConsent ? (
            <Card>
              <Row
                detail="Lagoon Hospital · Verified provider"
                icon={icons.recordStethoscope}
                title="Dr Amaka Bello"
              />
              <View className="mt-4">
                <Badge>Active</Badge>
              </View>
              <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
                Laboratory, medications & prescriptions, medical consultations
                · Treatment follow-up
              </Text>
              <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                Consent C-1031 · Granted 3 Oct, 9:41 AM{"\n"}
                Expires 4 Oct 2026, 9:41 AM · 24 hours
              </Text>
              <Pressable
                accessibilityRole="button"
                className="mt-4"
                onPress={() => router.push("/revoke-confirm")}
              >
                <Text className="text-xs font-semibold text-[#af4540]">
                  Revoke access now
                </Text>
              </Pressable>
            </Card>
          ) : (
            <Guidance title="Dr Amaka Bello access revoked">
              <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                Future access under C-1031 has ended. The revocation is saved
                in Record Activity.
              </Text>
            </Guidance>
          )}

          <Card>
            <Row
              detail="Caregiver · Separate WelliID WR-7204-1683"
              icon={icons.people}
              title="Chidi Okafor · Husband"
            />
            <View className="mt-4">
              <Badge>Limited</Badge>
            </View>
            <Text className="mt-4 text-sm text-[#173b71]">
              Medications & appointments only · Family support
            </Text>
            <Text className="mt-3 text-xs text-[#53657c]">
              Consent C-1024 · Expires 31 Oct 2026, 11:59 PM
            </Text>
            <Pressable accessibilityRole="button" className="mt-4">
              <Text className="text-xs font-semibold text-[#24518c]">
                Manage caregiver access
              </Text>
            </Pressable>
          </Card>

          {pendingConsent === "pending" ? (
            <>
              <SectionTitle>Pending your decision</SectionTitle>
              <Card className="border-[#f6d8a7] bg-[#fbf2e3]">
                <Row
                  detail="Requested 3 Oct, 9:10 AM · Verified laboratory"
                  icon={icons.recordLab}
                  title="SYNLAB Ikeja"
                />
                <View className="mt-4">
                  <Badge tone="amber">Pending</Badge>
                </View>
                <Text className="mt-4 text-sm leading-[1.45] text-[#173b71]">
                  Laboratory category only · Compare previous results for a
                  repeat test · Requested duration: 30 days
                </Text>
                <Text className="mt-3 text-xs text-[#53657c]">
                  No access until you approve.
                </Text>
                <View className="mt-4 flex-row gap-3">
                  <View className="flex-1">
                    <PrimaryButton onPress={approveConsent}>
                      Approve
                    </PrimaryButton>
                  </View>
                  <View className="flex-1">
                    <SecondaryButton onPress={rejectConsent}>
                      Reject
                    </SecondaryButton>
                  </View>
                </View>
              </Card>
            </>
          ) : (
            <Guidance
              title={
                pendingConsent === "approved"
                  ? "SYNLAB request approved"
                  : "SYNLAB request rejected"
              }
            >
              <Text className="text-[13px] leading-[1.45] text-[#173b71]">
                {pendingConsent === "approved"
                  ? "Laboratory-only access is active for 30 days and has been added to Record Activity."
                  : "No access was granted. Your decision has been added to Record Activity."}
              </Text>
            </Guidance>
          )}

          <SectionTitle
            action="All 3 →"
            onAction={() => router.push("/record-activity")}
          >
            Recently expired
          </SectionTitle>
          <Card>
            <Row
              detail="Prescription only · One-time access used 30 Sep · C-1026"
              icon={icons.pill}
              title="HealthPlus, Ikeja"
            />
            <View className="mt-3">
              <Badge>Expired</Badge>
            </View>
          </Card>

          <Guidance title="Revocation ends future access">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              It cannot undo a past view or erase records a provider must
              legally retain.
            </Text>
          </Guidance>

          <PrimaryButton onPress={() => router.push("/record-activity")}>
            Consent history & record activity
          </PrimaryButton>
          <SecondaryButton onPress={() => router.push("/record-activity")}>
            Review access history
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
