import React, { useEffect, useRef } from "react";
import { View, Text, ScrollView, Animated, Easing } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Guidance,
  Icon,
  ScreenIntroHeader,
  ScreenStack,
  SecondaryButton,
} from "../components/common";
import { icons } from "../constants/icons";

function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      className="rounded-[20px] border border-[#dae2ee] bg-white p-4 shadow-sm"
      style={{ opacity }}
    >
      <View className="h-4 rounded-md bg-[#dfe7f3]" />
      <View className="mt-3 h-3 rounded-md bg-[#edf2fa]" />
      <View className="mt-4 h-10 rounded-lg bg-[#e7edf6]" />
      <View className="mt-3 h-4 w-3/5 rounded-md bg-[#edf2fa]" />
    </Animated.View>
  );
}

export default function LabsLoadingScreen() {
  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Laboratory reports" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Adaeze Okafor · WR-4821-0936"
            eyebrow="RELIABILITY · LOADING, NOT EMPTY"
            title="Laboratory results"
          />
          <View className="flex-row items-center gap-4 rounded-[20px] bg-[#edf2fa] p-[22px]">
            <Icon size={32} src={icons.loader} />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-[#031f50]">
                Loading your reports…
              </Text>
              <Text className="mt-1 text-xs text-[#53657c]">
                Checking the latest available records.
              </Text>
            </View>
          </View>
          <Text className="text-xs text-[#53657c]">
            Report count will appear after loading.
          </Text>
          {[1, 2, 3].map((item) => (
            <SkeletonCard key={item} />
          ))}
          <Guidance title="Your cached records are still safe">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Loading does not delete your saved records. If the connection
              fails, you can return to the cached view.
            </Text>
          </Guidance>
          <SecondaryButton onPress={() => router.push("/reports")}>
            Cancel loading & go back
          </SecondaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
