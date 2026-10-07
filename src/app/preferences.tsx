import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Header } from "../components/navigation/Header";
import {
  Card,
  Choice,
  Guidance,
  PrimaryButton,
  ScreenIntroHeader,
  ScreenStack,
} from "../components/common";
import { storage } from "../utils/storage";
import { CONFIG } from "../services/config";
import { hapticFeedback } from "../utils/haptics";

const LANGUAGES = ["English", "Pidgin", "Hausa", "Yoruba", "Igbo"];

export default function PreferencesScreen() {
  const [language, setLanguage] = useState("English");
  const [large, setLarge] = useState(true);
  const [contrast, setContrast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storage.getItem(CONFIG.preferencesKey).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        if (saved.language) setLanguage(saved.language);
        if (typeof saved.large === "boolean") setLarge(saved.large);
        if (typeof saved.contrast === "boolean") setContrast(saved.contrast);
      } catch {
        // ignore malformed cache
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    hapticFeedback.success();
    await storage.setItem(
      CONFIG.preferencesKey,
      JSON.stringify({ language, large, contrast })
    );
    setSaving(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <Header canGoBack title="Language & accessibility" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-[22px] pb-10 pt-5"
      >
        <ScreenStack>
          <ScreenIntroHeader
            copy="Language and reading preferences can be changed later."
            eyebrow="PREFERENCES"
            title="Make it easier to use"
          />
          <View>
            <Text className="text-lg font-bold text-[#031f50]">
              Choose a language
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {LANGUAGES.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  className={`rounded-[14px] px-4 py-3 ${
                    language === item ? "bg-[#031f50]" : "bg-[#edf2fa]"
                  }`}
                  key={item}
                  onPress={() => setLanguage(item)}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      language === item ? "text-white" : "text-[#173b71]"
                    }`}
                  >
                    {language === item ? "✓ " : ""}
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          <Card className="gap-5">
            <Choice
              detail="Increase font size across all app screens"
              onPress={() => setLarge(!large)}
              selected={large}
              title={`Larger text · ${large ? "On" : "Off"}`}
            />
            <View className="rounded-[14px] bg-[#edf2fa] p-4">
              <Text className="text-xs font-semibold text-[#53657c]">
                LARGE-TEXT SAMPLE
              </Text>
              <Text className="mt-3 text-2xl font-bold leading-[1.25] text-[#031f50]">
                Choose who can see your records.
              </Text>
              <Text className="mt-3 text-lg text-[#173b71]">
                You can review and change access.
              </Text>
            </View>
            <Text className="text-xs text-[#53657c]">
              Text wraps inside cards. Buttons and labels stay readable.
            </Text>
          </Card>
          <Card className="gap-4">
            <Choice
              detail="Stronger borders and text contrast"
              onPress={() => setContrast(!contrast)}
              selected={contrast}
              title={`High contrast · ${contrast ? "On" : "Off"}`}
            />
            <Choice
              detail="Meaningful labels and logical reading order"
              selected
              title="Screen-reader support · On"
            />
            <Choice
              detail="Prefer static changes over movement"
              selected
              title="Reduce motion · On"
            />
          </Card>
          <Guidance title="Clinical originals stay unchanged">
            <Text className="text-[13px] leading-[1.45] text-[#173b71]">
              Navigation and explanations may be translated. Original reports
              retain their source language and content.
            </Text>
          </Guidance>
          <PrimaryButton disabled={saving} onPress={handleSave}>
            Save preferences
          </PrimaryButton>
        </ScreenStack>
      </ScrollView>
    </View>
  );
}
