import React from "react";
import { View, Text } from "react-native";
import { Header } from "../../components/navigation/Header";

// Not yet converted from the Figma Make web prototype — part of the
// Care Booking flow, scheduled for the next conversion batch.
export default function CareDiscoveryScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Find care near you" />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-sm text-[#53657c]">
          Care discovery is being converted to the native app in the next
          batch.
        </Text>
      </View>
    </View>
  );
}
