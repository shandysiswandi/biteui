import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { LoginMfaInput } from "../model/login"
import type { Token } from "../model/token"

type Response = {
  access_token: string
  refresh_token: string
}

export async function loginMfa(input: LoginMfaInput): Promise<Token> {
  const { data } = await apiPost<Response>(API_PATHS.identity.loginMfa, {
    challenge_token: input.challengeToken,
    method: input.method,
    code: input.code,
  })

  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}
