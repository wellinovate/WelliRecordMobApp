import { useCallback, useEffect, useRef, useState } from "react"
import { fetchLabs, type LabResult } from "../services/labService"
import { fetchVitals, type VitalEntry } from "../services/vitalService"
import {
  fetchMedications,
  type MedicationEntry,
} from "../services/medicationService"

export interface RecordsData {
  labs: LabResult[]
  vitals: VitalEntry[]
  medications: MedicationEntry[]
  loadedAt: Date | null
}

const EMPTY: RecordsData = { labs: [], vitals: [], medications: [], loadedAt: null }

// Module-level cache so switching tabs shows the last data immediately while
// a fresh copy loads (stale-while-revalidate). Cleared on sign-out.
let cache: RecordsData = EMPTY
export function clearRecordsCache() {
  cache = EMPTY
}

export function useRecords() {
  const [data, setData] = useState<RecordsData>(cache)
  const [loading, setLoading] = useState(cache.loadedAt === null)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "refresh") setRefreshing(true)
    else if (cache.loadedAt === null) setLoading(true)
    setError(null)

    // One failing collection must not hide the other two.
    const [labs, vitals, meds] = await Promise.allSettled([
      fetchLabs(),
      fetchVitals(),
      fetchMedications(),
    ])
    if (!mounted.current) return

    const results = [labs, vitals, meds]
    const failed = results.find((r) => r.status === "rejected") as
      | PromiseRejectedResult
      | undefined
    const next: RecordsData = {
      labs: labs.status === "fulfilled" ? labs.value : cache.labs,
      vitals: vitals.status === "fulfilled" ? vitals.value : cache.vitals,
      medications: meds.status === "fulfilled" ? meds.value : cache.medications,
      loadedAt: results.every((r) => r.status === "rejected")
        ? cache.loadedAt
        : new Date(),
    }
    cache = next
    setData(next)
    if (failed) {
      setError(
        failed.reason instanceof Error
          ? failed.reason.message
          : "Some records could not be loaded."
      )
    }
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    mounted.current = true
    load("initial")
    return () => {
      mounted.current = false
    }
  }, [load])

  return {
    ...data,
    loading,
    refreshing,
    error,
    refresh: () => load("refresh"),
  }
}
