import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuthStore } from "@/lib/stores/auth-store"

import { loginMfa } from "../api/login-mfa"
import type { LoginMfaInput } from "../model/login"
import type { Token } from "../model/token"
import { keys } from "./keys"

export function useLoginMfaMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: (input: LoginMfaInput) => loginMfa(input),
    onSuccess: async (output: Token) => {
      setSession({
        accessToken: output.accessToken,
        refreshToken: output.refreshToken,
      })

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.me }),
        queryClient.invalidateQueries({ queryKey: keys.permissions }),
      ])
    },
  })
}
