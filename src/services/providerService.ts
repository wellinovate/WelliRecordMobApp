import { apiRequest } from "./apiClient"

export interface Provider {
  id: string
  name: string
  type: string | null
  address: string
  isVerified: boolean
  wrOrgId: string | null
}

// Public directory of organizations registered through the WelliRecord
// provider portal. Read-only mirror of the web backend's OrganizationProfile.
export async function fetchProviders(): Promise<Provider[]> {
  const res = await apiRequest<{ success: boolean; providers: Provider[] }>(
    "/care/providers",
    { auth: false }
  )
  return res.providers ?? []
}
