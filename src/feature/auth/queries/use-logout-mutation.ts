import { useMutation, useQueryClient } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import { useAuthStore } from "@/lib/stores/auth-store"

import { keys } from "./keys"

async function logout(payload: { refresh_token: string }): Promise<void> {
  try {
    await apiPost(API_PATHS.identity.logout, payload, {
      auth: true,
      skipAuthRefresh: true,
    })
  } catch {
    // Logout is best-effort; ignore failures like 401.
  }
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const clearSession = useAuthStore((state) => state.clearSession)
  const refreshToken = useAuthStore((state) => state.refreshToken)

  return useMutation({
    mutationFn: () => {
      if (!refreshToken) return Promise.resolve()

      return logout({ refresh_token: refreshToken })
    },
    onSettled: async () => {
      clearSession()

      queryClient.removeQueries({ queryKey: keys.me })
      queryClient.removeQueries({ queryKey: keys.permissions })
    },
  })
}
