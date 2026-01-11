import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuthStore } from "@/lib/stores/auth-store"

import { refresh } from "../api/refresh"
import type { Token } from "../model/token"
import { keys } from "./keys"

export function useRefreshTokenMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const user = useAuthStore((state) => state.user)
  const permissions = useAuthStore((state) => state.permissions)

  return useMutation({
    mutationFn: (input: { refreshToken: string }) => refresh(input),
    onSuccess: async (output: Token) => {
      setSession({
        accessToken: output.accessToken,
        refreshToken: output.refreshToken,
        user,
        permissions,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.me }),
        queryClient.invalidateQueries({ queryKey: keys.permissions }),
      ])
    },
  })
}
