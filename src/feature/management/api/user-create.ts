import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { CreateUserInput } from "../model/user"

export async function userCreate(input: CreateUserInput): Promise<void> {
  await apiPost<void>(
    API_PATHS.identity.users,
    {
      email: input.email,
      password: input.password,
      full_name: input.name,
      status: input.status,
    },
    { auth: true },
  )
}
