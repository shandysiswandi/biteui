import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/feature/auth/shared/service/me"
import { usePreAuthStore } from "@/feature/auth/login/store/pre-auth-store"
import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import type { ApiEnvelope } from "@/lib/api/types"
import { useAuthStore } from "@/lib/stores/auth-store"

type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  mfa_required?: boolean
  challenge_token?: string
  access_token?: string
  refresh_token?: string
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const envelope = await apiPost<ApiEnvelope<LoginResponse>>(
    API_PATHS.auth.login,
    payload,
  )

  return envelope.data
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const setPreAuthSession = usePreAuthStore((state) => state.setPreAuthSession)
  const clearPreAuthSession = usePreAuthStore(
    (state) => state.clearPreAuthSession,
  )

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: async (result, variables) => {
      if (result.mfa_required && result.challenge_token) {
        setPreAuthSession({
          challengeToken: result.challenge_token,
          preAuthEmail: variables.email,
        })
        return
      }

      if (!result.access_token || !result.refresh_token) return

      setSession({
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
        user: null,
      })
      clearPreAuthSession()

      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me })
    },
  })
}
