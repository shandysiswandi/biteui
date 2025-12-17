import { getAccessToken } from "@/lib/api/auth-token"
import { ApiError } from "@/lib/api/error"
import { buildUrl } from "@/lib/api/url"

type ApiRequestOptions = Omit<RequestInit, "body" | "headers"> & {
  path: string
  baseUrl?: string
  query?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  headers?: HeadersInit
  auth?: boolean
}

function getBaseApiUrl() {
  return (import.meta.env.VITE_BASE_API_URL as string | undefined) ?? ""
}

function getErrorMessage(data: unknown, fallback: string) {
  if (data && typeof data === "object") {
    const maybeMessage = (data as { message?: unknown }).message
    if (typeof maybeMessage === "string" && maybeMessage.trim().length > 0) {
      return maybeMessage
    }
  }

  return fallback
}

export async function apiRequest<TResponse>(options: ApiRequestOptions) {
  const baseUrl = options.baseUrl ?? getBaseApiUrl()
  const url = buildUrl({ baseUrl, path: options.path, query: options.query })

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

  const contentType = response.headers.get("content-type") ?? ""
  const isJson = contentType.includes("application/json")

  let data: unknown = undefined
  if (response.status !== 204) {
    if (isJson) {
      data = await response.json().catch(() => undefined)
    } else {
      data = await response.text().catch(() => undefined)
    }
  }

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      data,
      message: getErrorMessage(data, response.statusText || "Request failed"),
    })
  }

  return data as TResponse
}

export function apiGet<TResponse>(
  path: string,
  options?: Omit<ApiRequestOptions, "path" | "method">,
) {
  return apiRequest<TResponse>({ ...options, path, method: "GET" })
}

export function apiPost<TResponse>(
  path: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, "path" | "method" | "body">,
) {
  return apiRequest<TResponse>({ ...options, path, method: "POST", body })
}

export function apiPut<TResponse>(
  path: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, "path" | "method" | "body">,
) {
  return apiRequest<TResponse>({ ...options, path, method: "PUT", body })
}
