import { useMutation } from "@tanstack/react-query"

import { apiPost, type ApiEnvelope } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth-store"

type RefreshTokenRequest = {
  refresh_token: string
}

type RefreshTokenResponse = {
  access_token: string
  refresh_token: string
}

async function refreshToken(
  payload: RefreshTokenRequest,
): Promise<RefreshTokenResponse> {
  const envelope = await apiPost<ApiEnvelope<RefreshTokenResponse>>(
    "/auth/refresh",
    payload,
  )

  return envelope.data
}

export function useRefreshTokenMutation() {
  const setSession = useAuthStore((state) => state.setSession)
  const user = useAuthStore((state) => state.user)

  return useMutation({
    mutationFn: (payload: RefreshTokenRequest) => refreshToken(payload),
    onSuccess: (result) => {
      setSession({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user,
      })
    },
  })
}
