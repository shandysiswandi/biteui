import { useMutation, useQueryClient } from "@tanstack/react-query"

import { authQueryKeys } from "@/feature/auth/shared/service/me"
import { apiPost, type ApiEnvelope } from "@/lib/api"
import { useAuthStore } from "@/lib/stores/auth-store"

type LogoutRequest = {
  refresh_token: string
}

async function logout(payload: LogoutRequest): Promise<void> {
  await apiPost<ApiEnvelope<unknown>>("/auth/logout", payload, {
    auth: true,
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const clearSession = useAuthStore((state) => state.clearSession)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) {
        return Promise.resolve()
      }
      return logout({ refresh_token: refreshToken })
    },
    onSettled: async () => {
      clearSession()
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.me })
    },
  })
}
