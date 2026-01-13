import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function passwordReset({
  challengeToken,
  newPassword,
}: {
  challengeToken: string
  newPassword: string
}): Promise<void> {
  await apiPost(API_PATHS.identity.password.reset, {
    challenge_token: challengeToken,
    new_password: newPassword,
  })
}
