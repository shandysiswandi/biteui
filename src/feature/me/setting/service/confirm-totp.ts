import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api"

export type ConfirmTotpRequest = {
  mfa_id: number
  code: string
}

export async function confirmTotp(payload: ConfirmTotpRequest): Promise<void> {
  await apiPost<void>("/auth/mfa/totp/confirm", payload, { auth: true })
}

export function useConfirmTotpMutation() {
  return useMutation({
    mutationFn: (payload: ConfirmTotpRequest) => confirmTotp(payload),
  })
}
