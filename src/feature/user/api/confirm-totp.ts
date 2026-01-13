import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { ConfirmTotpInput } from "../model/mfa"

export async function confirmTotp(input: ConfirmTotpInput): Promise<void> {
  await apiPost<void>(
    API_PATHS.identity.mfa.totp.confirm,
    {
      challenge_token: input.challengeToken,
      code: input.code,
    },
    {
      auth: true,
    },
  )
}
