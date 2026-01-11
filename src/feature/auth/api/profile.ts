import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"
import type { AuthUser } from "@/lib/types/auth"

type Response = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  status: string
}

export async function profile(): Promise<AuthUser> {
  const { data } = await apiGet<Response>(API_PATHS.identity.profile, { auth: true })

  return {
    id: data.id,
    email: data.email,
    name: data.full_name,
    avatarUrl: data.avatar_url,
    status: data.status,
  }
}
