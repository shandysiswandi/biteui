import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

type ForgotPasswordRequest = {
  email: string
}

async function forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
  await apiPost<unknown>(API_PATHS.auth.password.forgot, payload)
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => forgotPassword(payload),
  })
}
