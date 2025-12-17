import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api"

type ChangePasswordRequest = {
  current_password: string
  new_password: string
}

async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await apiPost<void>("/auth/password/change", payload, { auth: true })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  })
}
