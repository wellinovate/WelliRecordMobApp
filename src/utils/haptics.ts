/**
 * Universal Haptic Feedback Utility for WelliRecord
 * Provides tactile physical feedback on native iOS / Android and mobile web browsers.
 */
export const hapticFeedback = {
  light: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(10)
      }
    } catch {
      // safe fallback
    }
  },

  medium: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(25)
      }
    } catch {
      // safe fallback
    }
  },

  heavy: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(45)
      }
    } catch {
      // safe fallback
    }
  },

  selection: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(8)
      }
    } catch {
      // safe fallback
    }
  },

  success: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([15, 30, 20])
      }
    } catch {
      // safe fallback
    }
  },

  warning: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(35)
      }
    } catch {
      // safe fallback
    }
  },

  error: () => {
    try {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.([40, 30, 40])
      }
    } catch {
      // safe fallback
    }
  },
}

export default hapticFeedback
