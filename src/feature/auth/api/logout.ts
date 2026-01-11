import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function logout({ refreshToken }: { refreshToken: string }): Promise<void> {
  await apiPost<void>(API_PATHS.identity.logout, { refresh_token: refreshToken }, { auth: true })
}
