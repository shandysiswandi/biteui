import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export type ConfirmTotpRequest = {
  challenge_token: string
  code: string
}

export async function confirmTotp(payload: ConfirmTotpRequest): Promise<void> {
  await apiPost(API_PATHS.identity.mfa.totp.confirm, payload, {
    auth: true,
  })
}

export function useConfirmTotpMutation() {
  return useMutation({
    mutationFn: (payload: ConfirmTotpRequest) => confirmTotp(payload),
  })
}
