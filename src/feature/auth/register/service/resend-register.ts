import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

type ResendRegisterRequest = {
  email: string
}

async function resendRegisterVerification(
  payload: ResendRegisterRequest,
): Promise<void> {
  await apiPost<unknown>(API_PATHS.auth.registerResend, payload)
}

export function useResendRegisterMutation() {
  return useMutation({
    mutationFn: (payload: ResendRegisterRequest) =>
      resendRegisterVerification(payload),
  })
}
