import { useCallback, useState } from "react"
import { useFocusEffect } from "expo-router"
import { fetchGrants, type Grant } from "../services/consentService"

// Consent changes on the provider side too (new requests), so reload every
// time the screen regains focus instead of caching.
export function useGrants() {
  const [grants, setGrants] = useState<Grant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setGrants(await fetchGrants())
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load consent.")
    } finally {
      setLoading(false)
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  return { grants, loading, error, reload: load }
}
