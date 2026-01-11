import { useMutation } from "@tanstack/react-query"

import { passwordForgot } from "../api/password-forgot"

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (input: { email: string }) => passwordForgot(input),
  })
}
