import { useEffect, useRef } from "react"

import { usePermissionsQuery } from "@/feature/auth/queries/use-permissions-query"
import { useProfileQuery } from "@/feature/auth/queries/use-profile-query"
import { useRefreshTokenMutation } from "@/feature/auth/queries/use-refresh-mutation"
import { ApiError } from "@/lib/api/error"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((state) => state.bootstrap)
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const setUser = useAuthStore((state) => state.setUser)
  const setPermissions = useAuthStore((state) => state.setPermissions)
  const clearSession = useAuthStore((state) => state.clearSession)
  const { mutateAsync: refreshSession, isPending: isRefreshing } = useRefreshTokenMutation()
  const lastRefreshAttemptRef = useRef<string | null>(null)

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const profileQuery = useProfileQuery({ enabled: Boolean(accessToken) })
  const permissionsQuery = usePermissionsQuery({ enabled: Boolean(accessToken) })
  const {
    data: profileData,
    error: profileError,
    status: profileStatus,
    dataUpdatedAt: profileUpdatedAt,
    refetch: refetchProfile,
  } = profileQuery
  const {
    data: permissionsData,
    status: permissionsStatus,
    refetch: refetchPermissions,
  } = permissionsQuery

  useEffect(() => {
    if (!refreshToken || isRefreshing) {
      return
    }

    const isUnauthorized = profileError instanceof ApiError && profileError.status === 401
    const shouldRefresh = !accessToken || (profileStatus === "error" && isUnauthorized)

    if (!shouldRefresh) {
      return
    }

    const attemptKey = accessToken ? `error:${profileUpdatedAt}` : "bootstrap"
    if (lastRefreshAttemptRef.current === attemptKey) {
      return
    }

    lastRefreshAttemptRef.current = attemptKey

    refreshSession({ refreshToken: refreshToken })
      .then(() => {
        return Promise.all([refetchProfile(), refetchPermissions()])
      })
      .catch(() => {
        clearSession()
      })
  }, [
    accessToken,
    clearSession,
    profileError,
    profileStatus,
    profileUpdatedAt,
    refetchPermissions,
    refetchProfile,
    refreshSession,
    refreshToken,
    isRefreshing,
  ])

  useEffect(() => {
    if (!accessToken) {
      return
    }

    if (profileStatus === "success") {
      setUser(profileData ?? null)
      return
    }

    if (profileStatus === "error") {
      const isUnauthorized = profileError instanceof ApiError && profileError.status === 401

      if (!isUnauthorized) {
        return
      }

      if (refreshToken) {
        return
      }

      clearSession()
    }
  }, [accessToken, clearSession, profileData, profileError, profileStatus, refreshToken, setUser])

  useEffect(() => {
    if (!accessToken) {
      setPermissions(null)
      return
    }

    if (permissionsStatus !== "success" || !permissionsData) {
      return
    }

    setPermissions(permissionsData.permissions)
  }, [accessToken, permissionsData, permissionsStatus, setPermissions])

  return children
}
