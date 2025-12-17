import { useQuery } from "@tanstack/react-query"

import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import type { ApiEnvelope } from "@/lib/api/types"
import type { AuthUser } from "@/lib/types/auth"

type MeResponse = AuthUser

async function getMe(): Promise<MeResponse> {
  const envelope = await apiGet<ApiEnvelope<MeResponse>>(API_PATHS.profile, {
    auth: true,
  })
  return envelope.data
}

export const authQueryKeys = {
  me: ["auth", "me"] as const,
} as const

export function useMeQuery(params?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMe,
    enabled: params?.enabled,
  })
}
