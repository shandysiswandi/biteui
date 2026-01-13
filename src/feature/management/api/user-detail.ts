import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { User } from "../model/user"

type UserResponse = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  status: number
  updated_at: string
}

type Response = { user: UserResponse }

export async function userDetail(id: string): Promise<User> {
  const { data } = await apiGet<Response>(`${API_PATHS.identity.users}/${id}`, { auth: true })
  const user = data.user

  return {
    id: user.id,
    email: user.email,
    name: user.full_name,
    avatarUrl: user.avatar_url ?? "",
    status: user.status,
    updatedAt: new Date(user.updated_at),
  }
}
