import React from "react";
import { View, Text } from "react-native";
import { Header } from "../../components/navigation/Header";

// Not yet converted from the Figma Make web prototype — part of the
// Consent & Health Passport flow, scheduled for the next conversion batch.
export default function ConsentExpandedScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header rightAction="avatar" title="Share your record" />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-center text-sm text-[#53657c]">
          Consent sharing is being converted to the native app in the next
          batch.
        </Text>
      </View>
    </View>
  );
}
