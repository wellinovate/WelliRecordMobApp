import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { Icon } from "../common";
import { icons } from "../../constants/icons";

// Expo Router's Stack renders with headerShown:false (see src/app/_layout.tsx)
// so every screen embeds this itself, exactly like the original design —
// full control over the right-side action per screen instead of generic
// native chrome.
export function Header({
  title,
  canGoBack = false,
  onGoBack,
  rightAction = "none",
  onRightAction,
}: {
  title: string;
  canGoBack?: boolean;
  onGoBack?: () => void;
  rightAction?: "help" | "notifications" | "avatar" | "none";
  onRightAction?: () => void;
}) {
  return (
    <View className="z-20 border-b border-[#e7ecf4] bg-white/95">
      <View className="h-[72px] flex-row items-center gap-3 px-[22px]">
        {canGoBack && (
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="size-9 items-center justify-center rounded-full bg-[#edf2fa] active:scale-90"
            onPress={onGoBack ?? (() => router.back())}
          >
            <Text className="text-xl font-medium text-[#031f50]">‹</Text>
          </Pressable>
        )}
        <View className="min-w-0 flex-1">
          <Text className="text-[13px] font-bold tracking-[-0.02em] text-[#24518c]">
            Welli<Text className="text-[#031f50]">Record</Text>
          </Text>
          <Text className="text-lg font-bold text-[#031f50]" numberOfLines={1}>
            {title}
          </Text>
        </View>
        {rightAction === "help" && (
          <Pressable accessibilityRole="button" onPress={onRightAction}>
            <Text className="text-sm font-semibold text-[#031f50]">Help</Text>
          </Pressable>
        )}
        {rightAction === "notifications" && (
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            className="size-10 items-center justify-center rounded-full bg-[#edf2fa] active:scale-95"
            onPress={onRightAction}
          >
            <Icon src={icons.bell} />
          </Pressable>
        )}
        {rightAction === "avatar" && (
          <Pressable
            accessibilityLabel="Open profile"
            accessibilityRole="button"
            className="size-10 items-center justify-center rounded-full bg-[#edf2fa] active:scale-95"
            onPress={onRightAction}
          >
            <Text className="text-xs font-bold text-[#031f50]">AO</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
