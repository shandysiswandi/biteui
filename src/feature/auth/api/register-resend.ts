import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function registerResend(payload: { email: string }): Promise<void> {
  await apiPost(API_PATHS.identity.registerResend, payload)
}
