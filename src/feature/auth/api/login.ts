import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { LoginInput, LoginOutput } from "../model/login"

type Response = {
  mfa_required?: boolean
  challenge_token?: string
  access_token?: string
  refresh_token?: string
}

export async function login({ email, password }: LoginInput): Promise<LoginOutput> {
  const { data } = await apiPost<Response>(API_PATHS.identity.login, { email, password })

  return {
    mfaRequired: data.mfa_required,
    challengeToken: data.challenge_token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  }
}
