import { useMutation } from "@tanstack/react-query"

import { registerResend } from "../api/register-resend"

export function useResendRegisterMutation() {
  return useMutation({
    mutationFn: (input: { email: string }) => registerResend(input),
  })
}
