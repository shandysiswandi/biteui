import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { Token } from "../model/token"

type Response = {
  access_token: string
  refresh_token: string
}

export async function refresh({ refreshToken }: { refreshToken: string }): Promise<Token> {
  const { data } = await apiPost<Response>(API_PATHS.identity.refresh, {
    refresh_token: refreshToken,
  })

  return { accessToken: data.access_token, refreshToken: data.refresh_token }
}
