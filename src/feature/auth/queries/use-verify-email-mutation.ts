import { useMutation } from "@tanstack/react-query"

import { registerVerify } from "../api/register-verify"

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (input: { challengeToken: string }) => registerVerify(input),
  })
}
