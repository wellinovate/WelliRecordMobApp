/**
 * Universal Haptic Feedback Utility for WelliRecord
 * Native iOS/Android use expo-haptics (real taptic engine feedback); web
 * falls back to the Vibration API where the browser supports it.
 */
import { Platform } from "react-native"
import * as Haptics from "expo-haptics"

const isNative = Platform.OS !== "web"

function webVibrate(pattern: number | number[]) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate?.(pattern)
    }
  } catch {
    // safe fallback
  }
}

export const hapticFeedback = {
  light: () => {
    if (isNative) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
    } else {
      webVibrate(10)
    }
  },

  medium: () => {
    if (isNative) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {})
    } else {
      webVibrate(25)
    }
  },

  heavy: () => {
    if (isNative) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {})
    } else {
      webVibrate(45)
    }
  },

  selection: () => {
    if (isNative) {
      Haptics.selectionAsync().catch(() => {})
    } else {
      webVibrate(8)
    }
  },

  success: () => {
    if (isNative) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
    } else {
      webVibrate([15, 30, 20])
    }
  },

  warning: () => {
    if (isNative) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {})
    } else {
      webVibrate(35)
    }
  },

  error: () => {
    if (isNative) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {})
    } else {
      webVibrate([40, 30, 40])
    }
  },
}

export default hapticFeedback
