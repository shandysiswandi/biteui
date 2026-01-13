import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { PasswordChangeInput } from "../model/password"

export async function passwordChange(input: PasswordChangeInput): Promise<void> {
  await apiPost<void>(
    API_PATHS.identity.password.change,
    {
      current_password: input.currentPassword,
      new_password: input.newPassword,
    },
    {
      auth: true,
    },
  )
}
