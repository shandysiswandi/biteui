import { apiPut } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { UpdateUserInput } from "../model/user"

export async function userUpdate(input: UpdateUserInput): Promise<void> {
  const payload = {
    ...(input.email ? { email: input.email } : {}),
    ...(input.password ? { password: input.password } : {}),
    ...(input.name ? { full_name: input.name } : {}),
    ...(input.status !== undefined ? { status: input.status } : {}),
  }

  await apiPut<void>(`${API_PATHS.identity.users}/${input.id}`, payload, { auth: true })
}
