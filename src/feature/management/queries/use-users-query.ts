import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { compactObject } from "@/lib/utils/object"

import { userList } from "../api/users"
import type { UsersInput } from "../model/user"

export function useUsersQuery(input?: UsersInput & { enabled?: boolean }) {
  const { enabled = true, ...options } = input ?? {}
  const normalizedParams = compactObject(options)

  return useQuery({
    queryKey: ["identity", "user", "list", normalizedParams] as const,
    queryFn: () => userList(normalizedParams),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1m
  })
}
