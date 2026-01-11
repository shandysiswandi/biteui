import { useMutation } from "@tanstack/react-query"

import { passwordReset } from "../api/password-reset"

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (input: { challengeToken: string; newPassword: string }) => passwordReset(input),
  })
}
