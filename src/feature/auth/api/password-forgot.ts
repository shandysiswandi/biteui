import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

export async function passwordForgot({ email }: { email: string }): Promise<void> {
  await apiPost(API_PATHS.identity.password.forgot, { email })
}
