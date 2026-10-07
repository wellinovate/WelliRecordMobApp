/**
 * Universal Storage Utility for WelliRecord
 * Native iOS/Android use expo-secure-store (hardware-backed keychain /
 * keystore); web falls back to localStorage.
 */
import { Platform } from "react-native"
import * as SecureStore from "expo-secure-store"

const isNative = Platform.OS !== "web"

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isNative) {
        return await SecureStore.getItemAsync(key)
      }
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key)
      }
      return null
    } catch (err) {
      console.warn(`[storage] getItem failed for ${key}:`, err)
      return null
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.setItemAsync(key, value)
        return
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
    } catch (err) {
      console.warn(`[storage] setItem failed for ${key}:`, err)
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (isNative) {
        await SecureStore.deleteItemAsync(key)
        return
      }
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch (err) {
      console.warn(`[storage] removeItem failed for ${key}:`, err)
    }
  },
}

export default storage
