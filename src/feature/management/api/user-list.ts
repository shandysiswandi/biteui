import { apiGet } from "@/lib/api/client"
import { API_PATHS } from "@/lib/api/paths"

import type { User, UsersInput, UsersOutput } from "../model/user"

type UserResponse = {
  id: string
  email: string
  full_name: string
  avatar_url: string
  status: number
  updated_at: string
}

type Response = { users: UserResponse[] }

export async function userList(input?: UsersInput): Promise<UsersOutput> {
  const { data, meta } = await apiGet<Response>(API_PATHS.identity.users, {
    auth: true,
    query: {
      page: input?.page,
      size: input?.size,
      status: input?.status,
      search: input?.search,
      sort_by: input?.sortBy,
      sort_order: input?.sortOrder,
      date_from: input?.dateFrom,
      date_to: input?.dateTo,
    },
  })

  return {
    users: (data.users ?? []).map(
      (u): User => ({
        id: u.id,
        email: u.email,
        name: u.full_name,
        avatarUrl: u.avatar_url ?? "",
        status: u.status,
        updatedAt: new Date(u.updated_at),
      }),
    ),
    meta,
  }
}
