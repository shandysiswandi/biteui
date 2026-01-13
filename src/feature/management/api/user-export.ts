import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { User, UsersInput } from "../model/user"

type UserResponse = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  status: number
  updated_at: string
}

type Response = { users: UserResponse[] }

export async function userExport(input?: UsersInput): Promise<User[]> {
  const { data } = await apiGet<Response>(API_PATHS.identity.usersExport, {
    auth: true,
    query: {
      status: input?.status,
      search: input?.search,
      sort_by: input?.sortBy,
      sort_order: input?.sortOrder,
      date_from: input?.dateFrom,
      date_to: input?.dateTo,
    },
  })

  return (data.users ?? []).map((user) => ({
    id: user.id,
    email: user.email,
    name: user.full_name,
    avatarUrl: user.avatar_url ?? "",
    status: user.status,
    updatedAt: new Date(user.updated_at),
  }))
}
