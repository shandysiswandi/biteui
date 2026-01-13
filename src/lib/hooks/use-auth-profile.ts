import { useProfileQuery } from "@/feature/auth/queries/use-profile-query"
import { useAuthStore } from "@/lib/stores/auth-store"
import type { AuthUser } from "@/lib/types/auth"

export function useAuthProfile(): AuthUser | undefined {
  const accessToken = useAuthStore((state) => state.accessToken)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const profile = useProfileQuery({ enabled: Boolean(accessToken || refreshToken) })
  return profile.data
}
