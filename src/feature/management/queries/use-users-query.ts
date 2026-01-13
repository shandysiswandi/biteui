import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { compactObject } from "@/lib/utils/object"

import { userList } from "../api/user-list"
import type { UsersInput } from "../model/user"
import { keys } from "./keys"

export function useUsersQuery(input?: UsersInput & { enabled?: boolean }) {
  const { enabled = true, ...options } = input ?? {}
  const normalizedParams = compactObject(options)

  return useQuery({
    queryKey: [...keys.users, normalizedParams] as const,
    queryFn: () => userList(normalizedParams),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 60_000, // 1m
  })
}
