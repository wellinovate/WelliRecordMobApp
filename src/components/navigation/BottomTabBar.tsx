import React from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../common";
import { icons } from "../../constants/icons";

// expo-router's <Tabs> passes the same props a react-navigation bottom-tab
// bar gets, but doesn't publish a stable type for them under its own
// package exports — this is the minimal shape this component actually
// reads, not a full BottomTabBarProps re-declaration.
interface MinimalBottomTabBarProps {
  state: { index: number; routes: Array<{ key: string; name: string }> };
  navigation: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (routeName: string) => void;
  };
}

export const navItems = [
  ["home", icons.homeNav, "Home"],
  ["records", icons.clipboard, "My Health"],
  ["care-discovery", icons.stethoscope, "Care"],
  ["consent-expanded", icons.send, "Share"],
  ["profile", icons.fingerprint, "Profile"],
] as const;

// Custom tabBar render for expo-router's <Tabs>, in place of the default
// react-navigation bottom tab bar — keeps this app's own pill-highlight
// look exactly as designed instead of native-default tab styling.
export function BottomTabBar({ state, navigation }: MinimalBottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row border-t border-[#dae2ee] bg-white shadow-lg"
      style={{ paddingBottom: Math.max(8, insets.bottom), height: 68 + Math.max(0, insets.bottom - 8) }}
    >
      {navItems.map(([routeName, icon, label], index) => {
        const route = state.routes[index];
        const isActive = state.index === index;
        return (
          <Pressable
            accessibilityRole="button"
            className="flex-1 items-center justify-center gap-1"
            key={routeName}
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
          >
            <View
              className={`h-7 w-11 items-center justify-center rounded-full ${
                isActive ? "bg-[#edf2fa]" : ""
              }`}
            >
              <Icon size={19} src={icon} />
            </View>
            <Text
              className={`text-[10px] font-semibold ${
                isActive ? "text-[#031f50]" : "text-[#718096]"
              }`}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
