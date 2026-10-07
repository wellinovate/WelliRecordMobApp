import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../../components/navigation/Header";
import {
  Badge,
  Card,
  Icon,
  PrimaryButton,
  Row,
  ScreenStack,
  SectionTitle,
} from "../../components/common";
import { icons } from "../../constants/icons";

const FILTERS = ["All providers", "Reliance HMO", "Open now", "Specialty"];

export default function CareDiscoveryScreen() {
  const [filter, setFilter] = useState("All providers");
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Find care near you" />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <Pressable accessibilityRole="button" className="flex-row items-center gap-2">
            <Icon size={16} src={icons.careMapPin} />
            <Text className="text-xs font-semibold text-[#24518c]">
              Ikeja, Lagos · Set manually
            </Text>
          </Pressable>

          <View className="h-[52px] flex-row items-center gap-3 rounded-[14px] border border-[#dae2ee] bg-white px-4 shadow-sm">
            <Icon src={icons.search} />
            <TextInput
              className="flex-1 text-sm text-[#031f50]"
              onChangeText={setSearch}
              placeholder="What care do you need?"
              placeholderTextColor="#718096"
              value={search}
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {FILTERS.map((item) => (
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

          <SectionTitle>Your connected hospital</SectionTitle>
          <Card className="overflow-hidden p-0 shadow-sm">
            <Image
              accessibilityLabel="Lagoon Hospital exterior"
              className="h-44 w-full"
              resizeMode="cover"
              source={icons.hospitalPhoto}
            />
            <View className="p-[18px]">
              <Text className="text-lg font-bold text-[#031f50]">
                Lagoon Hospital, Ikeja
              </Text>
              <Text className="mt-3 text-xs leading-[1.45] text-[#53657c]">
                Hospital · 2.1 km · Open 24 hours{"\n"}3 Obafemi Awolowo Way,
                Ikeja
              </Text>
              <View className="mt-3 flex-row gap-2">
                <Badge>Participating</Badge>
                <Badge>Reliance accepted</Badge>
              </View>
              <View className="mt-4">
                <PrimaryButton onPress={() => router.push("/booking-time")}>
                  Book an appointment
                </PrimaryButton>
              </View>
            </View>
          </Card>

          <SectionTitle action="Map view">More ways to get care</SectionTitle>
          <Card>
            <Row
              detail="Laboratory · 1.4 km · Today, 8 AM–4 PM"
              icon={icons.lab}
              onPress={() => router.push("/reports")}
              title="SYNLAB Ikeja"
            />
            <Text className="mt-4 text-xs text-[#53657c]">
              Participating provider · Reliance: eligible tests
            </Text>
          </Card>
          <Card>
            <Row
              detail="Pharmacy · 0.8 km · Open until 9 PM"
              icon={icons.pill}
              title="HealthPlus, Ikeja"
            />
            <Text className="mt-4 text-xs text-[#53657c]">
              Participating provider · Reliance: approved prescriptions
            </Text>
          </Card>
          <Card>
            <Row
              detail="Internal medicine · Lagoon Hospital · Mon, 5 Oct"
              icon={icons.stethoscope}
              onPress={() => router.push("/booking-time")}
              title="Dr Amaka Bello"
            />
          </Card>

          <Text className="text-xs leading-[1.45] text-[#53657c]">
            Coverage may require HMO authorization. Confirm eligibility and
            opening times with the provider.
          </Text>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
