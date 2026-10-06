/**
 * Universal Storage Utility for WelliRecord
 * Works seamlessly across Web (localStorage) and React Native / Expo.
 */
export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
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
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value)
      }
    } catch (err) {
      console.warn(`[storage] setItem failed for ${key}:`, err)
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key)
      }
    } catch (err) {
      console.warn(`[storage] removeItem failed for ${key}:`, err)
    }
  },
}

export default storage
