import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useAuthStore } from "@/lib/stores/auth-store"

import { login } from "../api/login"
import type { LoginInput, LoginOutput } from "../model/login"
import { usePreAuthStore } from "../stores/use-pre-auth-store"
import { keys } from "./keys"

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const setSession = useAuthStore((state) => state.setSession)
  const setPreAuthSession = usePreAuthStore((state) => state.setPreAuthSession)
  const clearPreAuthSession = usePreAuthStore((state) => state.clearPreAuthSession)

  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: async (output: LoginOutput, input: LoginInput) => {
      if (output.mfaRequired) {
        if (output.challengeToken) {
          setPreAuthSession({
            challengeToken: output.challengeToken,
            preAuthEmail: input.email,
          })
        } else {
          clearPreAuthSession()
        }
        return
      }

      if (!output.accessToken || !output.refreshToken) return

      setSession({
        accessToken: output.accessToken,
        refreshToken: output.refreshToken,
      })
      clearPreAuthSession()

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: keys.me }),
        queryClient.invalidateQueries({ queryKey: keys.permissions }),
      ])
    },
  })
}
