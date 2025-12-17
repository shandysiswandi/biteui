import { useEffect, useRef } from "react"

import { useMeQuery } from "@/feature/auth/shared/service/me"
import { useRefreshTokenMutation } from "@/feature/auth/shared/service/refresh-token"
import { ApiError } from "@/lib/api/error"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const setUser = useAuthStore((state) => state.setUser)
  const clearSession = useAuthStore((state) => state.clearSession)
  const refreshTokenMutation = useRefreshTokenMutation()
  const lastRefreshAttemptRef = useRef<string | null>(null)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const meQuery = useMeQuery({ enabled: Boolean(accessToken) })
  const {
    data: meData,
    error: meError,
    errorUpdatedAt: meErrorUpdatedAt,
    refetch: refetchMe,
    status: meStatus,
  } = meQuery

  useEffect(() => {
    if (!refreshToken || refreshTokenMutation.isPending) {
      return
    }

    const isUnauthorized = meError instanceof ApiError && meError.status === 401
    const shouldRefresh =
      !accessToken || (meStatus === "error" && isUnauthorized)

    if (!shouldRefresh) {
      return
    }

    const attemptKey = accessToken ? `error:${meErrorUpdatedAt}` : "bootstrap"
    if (lastRefreshAttemptRef.current === attemptKey) {
      return
    }

    lastRefreshAttemptRef.current = attemptKey

    refreshTokenMutation
      .mutateAsync({ refresh_token: refreshToken })
      .then(() => {
        if (accessToken) {
          return refetchMe()
        }
        return null
      })
      .catch(() => {
        clearSession()
      })
  }, [
    accessToken,
    clearSession,
    meError,
    meErrorUpdatedAt,
    meStatus,
    refetchMe,
    refreshToken,
    refreshTokenMutation,
  ])

  useEffect(() => {
    if (!accessToken) {
      return
    }

    if (meStatus === "success") {
      setUser(meData ?? null)
      return
    }

    if (meStatus === "error") {
      const isUnauthorized =
        meError instanceof ApiError && meError.status === 401

      if (!isUnauthorized) {
        return
      }

      if (refreshToken) {
        return
      }

      clearSession()
    }
  }, [
    accessToken,
    clearSession,
    meData,
    meError,
    meStatus,
    refreshToken,
    setUser,
  ])

  return children
}
