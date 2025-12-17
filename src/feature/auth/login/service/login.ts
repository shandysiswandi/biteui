import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/feature/auth/shared/service/me"
import { apiPost, type ApiEnvelope } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth-store"

type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  mfa_required?: boolean
  challenge_id?: string
  access_token?: string
  refresh_token?: string
}

const loginEndpoint = "/auth/login"

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const envelope = await apiPost<ApiEnvelope<LoginResponse>>(
    loginEndpoint,
    payload,
  )

  return envelope.data
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const setPreAuthSession = useAuthStore((state) => state.setPreAuthSession)

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: async (result, variables) => {
      if (result.mfa_required && result.challenge_id) {
        setPreAuthSession({
          challenge_id: result.challenge_id,
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

      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me })
    },
  })
}
