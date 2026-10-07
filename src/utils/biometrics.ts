/**
 * Biometrics Authentication Service (Face ID / Touch ID / Biometrics)
 * Wraps expo-local-authentication for real hardware detection and
 * authentication on iOS/Android. On web (no Local Authentication API),
 * reports unavailable rather than faking a pass.
 */
import { Platform } from "react-native"
import * as LocalAuthentication from "expo-local-authentication"

export interface BiometricStatus {
  isAvailable: boolean
  hasHardware: boolean
  isEnrolled: boolean
  biometryType: "face" | "fingerprint" | "iris" | "generic" | "none"
  label: string
}

function labelFor(types: LocalAuthentication.AuthenticationType[]): {
  biometryType: BiometricStatus["biometryType"]
  label: string
} {
  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return { biometryType: "face", label: "Face ID" }
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return { biometryType: "fingerprint", label: "Touch ID" }
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return { biometryType: "iris", label: "Iris Scan" }
  }
  return { biometryType: "generic", label: "Biometrics" }
}

export async function getBiometricStatus(): Promise<BiometricStatus> {
  if (Platform.OS === "web") {
    return {
      isAvailable: false,
      hasHardware: false,
      isEnrolled: false,
      biometryType: "none",
      label: "Biometrics",
    }
  }

  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  const types = await LocalAuthentication.supportedAuthenticationTypesAsync()
  const { biometryType, label } = labelFor(types)

  return {
    isAvailable: hasHardware && isEnrolled,
    hasHardware,
    isEnrolled,
    biometryType: hasHardware && isEnrolled ? biometryType : "none",
    label,
  }
}

export async function authenticateWithBiometrics(
  promptMessage = "Unlock WelliRecord with Face ID"
): Promise<{ success: boolean; error?: string }> {
  if (Platform.OS === "web") {
    return { success: false, error: "Biometric authentication isn't available on web" }
  }

  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    })
    if (result.success) {
      return { success: true }
    }
    return { success: false, error: result.error }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication failed"
    return { success: false, error: message }
  }
}
