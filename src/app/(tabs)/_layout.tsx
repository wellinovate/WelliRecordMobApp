import React from "react";
import { Tabs } from "expo-router";
import { BottomTabBar } from "../../components/navigation/BottomTabBar";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="care-discovery" />
      <Tabs.Screen name="consent-expanded" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
