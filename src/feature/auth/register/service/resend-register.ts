import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api"

type ResendRegisterRequest = {
  email: string
}

async function resendRegisterVerification(
  payload: ResendRegisterRequest,
): Promise<void> {
  await apiPost<unknown>("/auth/register/resend", payload)
}

export function useResendRegisterMutation() {
  return useMutation({
    mutationFn: (payload: ResendRegisterRequest) =>
      resendRegisterVerification(payload),
  })
}
