import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useWelli } from "../state/WelliContext";

// Entry route: waits for the stored "setup complete" flag to resolve
// (SecureStore read is async) then sends the person to the tabs or into
// the welcome/create-account flow.
export default function Index() {
  const { isAuthReady, isAuthenticated } = useWelli();

  if (!isAuthReady) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#031f50" size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(tabs)/home" : "/welcome"} />;
}
