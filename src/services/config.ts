/**
 * WelliRecord Global Configuration
 */
export const CONFIG = {
  appName: "WelliRecord",
  appVersion: "1.0.0",
  // Mobile backend (wellinovate/WelliRecordMobileApp, Render). Override per
  // build with EXPO_PUBLIC_API_URL, e.g. a local tunnel while developing.
  apiUrl: (
    process.env.EXPO_PUBLIC_API_URL ??
    "https://wellirecordmobileapp.onrender.com/api/v1"
  ).replace(/\/+$/, ""),
  requestTimeoutMs: 20000,
  offlineKey: "wr_offline_vault_cache",
  emergencyKey: "wr_emergency_profile_cache",
  medicationsKey: "wr_medications_cache",
  syncQueueKey: "wr_sync_queue",
  preferencesKey: "wr_preferences",
}
