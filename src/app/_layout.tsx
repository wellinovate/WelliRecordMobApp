import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { WelliProvider } from "../state/WelliContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <WelliProvider>
          <StatusBar style="dark" />
          {/* Each screen renders its own <Header/> (see Header.tsx) so the
              native chrome here stays off, matching the original design. */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </WelliProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
