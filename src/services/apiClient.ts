import { CONFIG } from "./config"
import { storage } from "../utils/storage"

export const TOKEN_KEY = "wellirecord-auth-token"

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

// WelliContext registers this so an expired or revoked token (401 on an
// authenticated call) signs the person out instead of leaving every screen
// failing silently.
let onUnauthorized: (() => void) | null = null
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  // Public endpoints (OTP send, provider directory) skip the Bearer header.
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  { method = "GET", body, auth = true }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" }
  if (body !== undefined) headers["Content-Type"] = "application/json"
  if (auth) {
    const token = await storage.getItem(TOKEN_KEY)
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), CONFIG.requestTimeoutMs)

  let res: Response
  try {
    res = await fetch(`${CONFIG.apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError"
    throw new ApiError(
      aborted
        ? "The server took too long to respond. Try again."
        : "Can't reach WelliRecord. Check your connection.",
      0
    )
  } finally {
    clearTimeout(timer)
  }

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // Non-JSON body (e.g. a proxy error page); fall through to status handling.
  }

  if (!res.ok) {
    if (res.status === 401 && auth) onUnauthorized?.()
    throw new ApiError(
      data?.message || `Request failed (${res.status})`,
      res.status
    )
  }
  return data as T
}
