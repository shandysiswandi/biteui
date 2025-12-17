import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/feature/auth/shared/service/me"
import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import type { ApiEnvelope } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth-store"

type LoginMfaRequest = {
  challenge_token: string
  code: string
}

type LoginMfaResponse = {
  access_token: string
  refresh_token: string
}

async function loginMfa(payload: LoginMfaRequest): Promise<LoginMfaResponse> {
  const envelope = await apiPost<ApiEnvelope<LoginMfaResponse>>(
    API_PATHS.auth.loginMfa,
    payload,
  )

  return envelope.data
}

export function useLoginMfaMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginMfaRequest) => loginMfa(payload),
    onSuccess: async (result) => {
      if (!result.access_token || !result.refresh_token) {
        return
      }

      setSession({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: null,
      })

      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me })
    },
  })
}
