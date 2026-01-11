import { useMutation } from "@tanstack/react-query"

import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import type { ApiEnvelope } from "@/lib/api/types"

export type SetupTotpRequest = {
  friendly_name: string
  current_password: string
}

export type SetupTotpResponse = {
  challenge_token: string
  key: string
  uri: string
}

export async function setupTotp(payload: SetupTotpRequest): Promise<SetupTotpResponse> {
  const envelope = (await apiPost(API_PATHS.identity.mfa.totp.setup, payload, {
    auth: true,
  })) as ApiEnvelope<SetupTotpResponse>
  return envelope.data
}

export function useSetupTotpMutation() {
  return useMutation({
    mutationFn: (payload: SetupTotpRequest) => setupTotp(payload),
  })
}
