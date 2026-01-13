import { ApiError } from "@/lib/api/error"
import { API_PATHS } from "@/lib/api/paths"
import { getAccessToken, getRefreshToken } from "@/lib/api/storage-token"
import type { ApiEnvelope } from "@/lib/api/types"
import { buildUrl, type QueryValue } from "@/lib/api/url"
import { useAuthStore } from "@/lib/stores/auth-store"

type ApiRequestOptions<Body = unknown> = Omit<RequestInit, "body" | "headers"> & {
  path: string
  baseUrl?: string
  query?: Record<string, QueryValue>
  body?: Body
  headers?: HeadersInit
  auth?: boolean
  skipAuthRefresh?: boolean
}

function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "string" && data.trim().length > 0) {
    return data
  }

  if (typeof data === "object" && data !== null && "message" in data) {
    const maybeMessage = typeof data.message === "string" ? data.message : ""
    if (maybeMessage.trim().length > 0) {
      return maybeMessage
    }
  }

  return fallback
}

let refreshPromise: Promise<{
  access_token: string
  refresh_token: string
} | null> | null = null

async function refreshSession(baseUrl?: string): Promise<{
  access_token: string
  refresh_token: string
} | null> {
  if (refreshPromise) {
    return refreshPromise
  }

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return null
  }

  refreshPromise = (async () => {
    const { data } = await apiRequest<{
      access_token: string
      refresh_token: string
    }>({
      path: API_PATHS.identity.refresh,
      method: "POST",
      body: { refresh_token: refreshToken },
      baseUrl,
      skipAuthRefresh: true,
    })

    const authState = useAuthStore.getState()
    authState.setSession({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    })

    return data
  })()

  try {
    return await refreshPromise
  } finally {
    refreshPromise = null
  }
}

export async function apiRequest<RData, Body = unknown>(
  options: ApiRequestOptions<Body>,
): Promise<ApiEnvelope<RData>> {
  const baseUrl = options.baseUrl ?? import.meta.env.VITE_API_URL
  const url = buildUrl({ baseUrl, path: options.path, query: options.query })
  const isRefreshRequest = options.path === API_PATHS.identity.refresh
  const canRefresh = options.auth && !options.skipAuthRefresh && !isRefreshRequest

  const execute = async () => {
    const headers = new Headers(options.headers)

    if (!headers.has("Accept")) {
      headers.set("Accept", "application/json")
    }

    const hasBody = options.body !== undefined
    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    if (options.auth) {
      const token = getAccessToken()
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    })

    const isJson = response.headers.get("content-type")?.includes("application/json")

    let data: unknown = undefined
    if (response.status !== 204) {
      if (isJson) {
        data = await response.json().catch(() => undefined)
      } else {
        data = await response.text().catch(() => undefined)
      }
    }

    return { response, data }
  }

  let result = await execute()

  if (!result.response.ok && result.response.status === 401) {
    if (canRefresh) {
      try {
        const refreshed = await refreshSession(baseUrl)
        if (refreshed) {
          result = await execute()
        }
      } catch {
        useAuthStore.getState().clearSession()
      }
    } else if (options.auth) {
      useAuthStore.getState().clearSession()
    }
  }

  if (!result.response.ok) {
    throw new ApiError({
      status: result.response.status,
      data: result.data,
      message: getErrorMessage(result.data, result.response.statusText || "Request failed"),
    })
  }

  return result.data as ApiEnvelope<RData>
}

export function apiGet<RData>(
  path: string,
  options?: Omit<ApiRequestOptions, "path" | "method">,
): Promise<ApiEnvelope<RData>> {
  return apiRequest<RData>({ ...options, path, method: "GET" })
}

export function apiPost<RData, Body = unknown>(
  path: string,
  body?: Body,
  options?: Omit<ApiRequestOptions<Body>, "path" | "method" | "body">,
): Promise<ApiEnvelope<RData>> {
  return apiRequest<RData, Body>({ ...options, path, method: "POST", body })
}

export function apiPut<RData, Body = unknown>(
  path: string,
  body?: Body,
  options?: Omit<ApiRequestOptions<Body>, "path" | "method" | "body">,
): Promise<ApiEnvelope<RData>> {
  return apiRequest<RData, Body>({ ...options, path, method: "PUT", body })
}

export function apiPatch<RData, Body = unknown>(
  path: string,
  body?: Body,
  options?: Omit<ApiRequestOptions<Body>, "path" | "method" | "body">,
): Promise<ApiEnvelope<RData>> {
  return apiRequest<RData, Body>({ ...options, path, method: "PATCH", body })
}

export function apiDelete<RData>(
  path: string,
  options?: Omit<ApiRequestOptions, "path" | "method">,
): Promise<ApiEnvelope<RData>> {
  return apiRequest<RData>({ ...options, path, method: "DELETE" })
}
