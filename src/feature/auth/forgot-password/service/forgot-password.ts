import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api"

type ForgotPasswordRequest = {
  email: string
}

async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiPost<unknown>("/auth/password/forgot", payload)
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
  })
}
