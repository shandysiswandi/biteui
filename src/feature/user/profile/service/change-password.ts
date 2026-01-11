import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

type ChangePasswordRequest = {
  current_password: string
  new_password: string
}

async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await apiPost(API_PATHS.identity.password.change, payload, {
    auth: true,
  })
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  })
}
