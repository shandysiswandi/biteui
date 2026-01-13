import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { SetupTotpInput, SetupTotpOutput } from "../model/mfa"

export type SetupTotpRequest = {
  friendly_name: string
  current_password: string
}

type SetupTotpResponse = {
  challenge_token: string
  key: string
  uri: string
}

export async function setupTotp(input: SetupTotpInput): Promise<SetupTotpOutput> {
  const { data } = await apiPost<SetupTotpResponse>(
    API_PATHS.identity.mfa.totp.setup,
    {
      friendly_name: input.friendlyName,
      current_password: input.currentPassword,
    },
    {
      auth: true,
    },
  )
  return { challengeToken: data.challenge_token, key: data.key, uri: data.uri }
}
