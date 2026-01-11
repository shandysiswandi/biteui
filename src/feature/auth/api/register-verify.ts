import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function registerVerify({
  challengeToken,
}: {
  challengeToken: string
}): Promise<void> {
  await apiPost<void>(API_PATHS.identity.registerVerify, { challenge_token: challengeToken })
}
