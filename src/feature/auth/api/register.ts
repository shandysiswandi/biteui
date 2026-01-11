import { apiPost } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { RegisterInput } from "../model/register"

export async function register({ email, password, name }: RegisterInput): Promise<void> {
  await apiPost<void>(API_PATHS.identity.register, {
    email,
    password,
    full_name: name,
  })
}
