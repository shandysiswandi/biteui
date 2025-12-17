import { useMutation } from "@tanstack/react-query"

import { apiPost, type ApiEnvelope } from "@/lib/api"

export type SetupTotpRequest = {
  friendly_name: string
}

export type SetupTotpResponse = {
  mfa_id: number
  secret: string
  uri: string
}

export async function setupTotp(
  payload: SetupTotpRequest,
): Promise<SetupTotpResponse> {
  const envelope = await apiPost<ApiEnvelope<SetupTotpResponse>>(
    "/auth/mfa/totp/setup",
    payload,
    { auth: true },
  )

  return envelope.data
}

export function useSetupTotpMutation() {
  return useMutation({
    mutationFn: (payload: SetupTotpRequest) => setupTotp(payload),
  })
}
